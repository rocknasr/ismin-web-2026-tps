import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { ApiError, fetchModel } from '../api';
import { formatDownloads, formatParameters } from '../format';
import { TASK_LABELS } from '../model';

/**
 * The page of one model, at /models/:id: the model whose id is in the URL.
 * Three states, like CatalogPage. A 404 of the API means the model does not
 * exist: "Modèle introuvable.", not a generic error.
 */
export const ModelPage = () => {
  // The route is /models/:id, so the id is always there on this page.
  // React Router can't know that at compile time, hence the `!`.
  const id = useParams().id!;

  // The key holds the id: one cache entry per model. A new id, a new query.
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['model', id],
    queryFn: () => fetchModel(id),
  });

  return (
    <section className="page">
      <Link className="back" to="/">
        ← Retour au catalogue
      </Link>

      {isPending && (
        <p className="status" role="status">
          Chargement…
        </p>
      )}
      {isError && (
        <div className="error" role="alert">
          <span>
            {error instanceof ApiError && error.status === 404
              ? 'Modèle introuvable.'
              : `Impossible de charger le modèle : ${error.message}`}
          </span>
        </div>
      )}
      {data && (
        <article className="detail">
          <header className="detail-header">
            <h2 className="detail-title">{data.name}</h2>
            <span className="badge">{TASK_LABELS[data.task]}</span>
          </header>

          <dl className="detail-fields">
            <div>
              <dt>Identifiant</dt>
              <dd>{data.id}</dd>
            </div>
            <div>
              <dt>Organisation</dt>
              <dd>{data.org}</dd>
            </div>
            <div>
              <dt>Paramètres</dt>
              <dd>{formatParameters(data.parameters)}</dd>
            </div>
            <div>
              <dt>Téléchargements</dt>
              <dd>{formatDownloads(data.downloads)}</dd>
            </div>
            <div>
              <dt>Licence</dt>
              <dd>{data.license ?? 'Non précisée'}</dd>
            </div>
            {data.createdBy && (
              <div>
                <dt>Ajouté par</dt>
                <dd>{data.createdBy}</dd>
              </div>
            )}
          </dl>
        </article>
      )}
    </section>
  );
};