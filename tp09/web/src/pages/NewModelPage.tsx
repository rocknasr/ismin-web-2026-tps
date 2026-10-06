import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ApiError, createModel } from '../api';
import { useAuth } from '../auth/AuthProvider';
import type { Task } from '../model';

/** What the form holds: strings only, as the inputs give them. */
interface Draft {
  id: string;
  name: string;
  org: string;
  task: Task;
  parameters: string;
  license: string;
}

const EMPTY_DRAFT: Draft = { id: '', name: '', org: '', task: 'text-generation', parameters: '', license: '' };

/** What to show of an error of the API: a sentence, and the details of a 400. */
interface FormError {
  message: string;
  details: string[];
}

/**
 * The creation form, at /models/new, for the logged-in only. One state for
 * the whole draft. On submit, `createModel(…, token)`, then the page of the
 * new model. The API's errors go in a `role="alert"`, above the button, which
 * is disabled while the API has not answered. A 401, the token has expired:
 * log out, RequireAuth sends to the login page, which brings back here.
 */
export const NewModelPage = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    setIsSending(true);
    setError(null);
    try {
      const model = await createModel(
        {
          id: draft.id,
          name: draft.name,
          org: draft.org,
          task: draft.task,
          parameters: Number(draft.parameters),
          license: draft.license || undefined,
        },
        token,
      );
      navigate(`/models/${model.id}`);
    } catch (error) {
      setIsSending(false);
      if (!(error instanceof ApiError)) {
        setError({ message: `Impossible d'ajouter le modèle : ${String(error)}`, details: [] });
      } else if (error.status === 401) {
        logout();
      } else if (error.status === 400) {
        setError({ message: 'Le formulaire contient des erreurs :', details: error.details });
      } else if (error.status === 409) {
        setError({ message: 'Un modèle avec cet identifiant existe déjà.', details: [] });
      } else if (error.status === 422) {
        setError({ message: "Organisation inconnue : créez-la d'abord.", details: [] });
      } else {
        setError({ message: `Impossible d'ajouter le modèle : ${error.message}`, details: [] });
      }
    }
  };

  return (
    <section className="page form-page wide">
      <h2>Ajouter un modèle</h2>

      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="model-id">Identifiant</label>
          <input id="model-id" name="id" aria-describedby="model-id-hint" value={draft.id} onChange={onChange} />
          <p className="field-hint" id="model-id-hint">
            En minuscules, avec des tirets&nbsp;: il sera dans l'adresse de la page.
          </p>
        </div>

        <div className="field">
          <label htmlFor="model-name">Nom</label>
          <input id="model-name" name="name" value={draft.name} onChange={onChange} />
        </div>

        <div className="field">
          <label htmlFor="model-org">Organisation</label>
          <input id="model-org" name="org" aria-describedby="model-org-hint" value={draft.org} onChange={onChange} />
          <p className="field-hint" id="model-org-hint">
            Le slug, par exemple mistralai.
          </p>
        </div>

        <div className="field">
          <label htmlFor="model-task">Tâche</label>
          <select id="model-task" name="task" value={draft.task} onChange={onChange}>
            <option value="text-generation">Génération de texte</option>
            <option value="translation">Traduction</option>
            <option value="image-classification">Classification d'images</option>
            <option value="speech-to-text">Reconnaissance vocale</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="model-parameters">Paramètres (en milliards)</label>
          <input
            id="model-parameters"
            name="parameters"
            type="number"
            min="0"
            step="any"
            value={draft.parameters}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label htmlFor="model-license">Licence (facultative)</label>
          <input id="model-license" name="license" value={draft.license} onChange={onChange} />
        </div>

        {error && (
          <div className="error form-error" role="alert">
            <p>{error.message}</p>
            {error.details.length > 0 && (
              <ul>
                {error.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button className="button" type="submit" disabled={isSending}>
          Ajouter
        </button>
      </form>
    </section>
  );
};
