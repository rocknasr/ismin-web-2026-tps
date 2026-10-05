/**
 * TODO step 6. The creation form, at /models/new, for the logged-in only.
 *
 * Below, the mockup. Make the form controlled: one state for the whole
 * draft, an object of strings, and an `onChange` per field. On submit,
 * `createModel(…, token)`, then the page of the new model. The API's errors
 * go in a `role="alert"`, above the button:
 *   400  "Le formulaire contient des erreurs :" and the `details`, as a list
 *   409  "Un modèle avec cet identifiant existe déjà."
 *   422  "Organisation inconnue : créez-la d'abord."
 * The button is disabled while the API has not answered.
 *
 * TODO step 7: a 401, the token has expired. Log out: RequireAuth sends to
 * the login page, which brings back here.
 */
export const NewModelPage = () => {
  return (
    <section className="page form-page wide">
      <h2>Ajouter un modèle</h2>

      <form className="form">
        <div className="field">
          <label htmlFor="model-id">Identifiant</label>
          <input id="model-id" name="id" aria-describedby="model-id-hint" />
          <p className="field-hint" id="model-id-hint">
            En minuscules, avec des tirets&nbsp;: il sera dans l'adresse de la page.
          </p>
        </div>

        <div className="field">
          <label htmlFor="model-name">Nom</label>
          <input id="model-name" name="name" />
        </div>

        <div className="field">
          <label htmlFor="model-org">Organisation</label>
          <input id="model-org" name="org" aria-describedby="model-org-hint" />
          <p className="field-hint" id="model-org-hint">
            Le slug, par exemple mistralai.
          </p>
        </div>

        <div className="field">
          <label htmlFor="model-task">Tâche</label>
          <select id="model-task" name="task">
            <option value="text-generation">Génération de texte</option>
            <option value="translation">Traduction</option>
            <option value="image-classification">Classification d'images</option>
            <option value="speech-to-text">Reconnaissance vocale</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="model-parameters">Paramètres (en milliards)</label>
          <input id="model-parameters" name="parameters" type="number" min="0" step="any" />
        </div>

        <div className="field">
          <label htmlFor="model-license">Licence (facultative)</label>
          <input id="model-license" name="license" />
        </div>

        <button className="button" type="submit">
          Ajouter
        </button>
      </form>
    </section>
  );
};
