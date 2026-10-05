import { formatDownloads, formatParameters } from '../format';
import { TASK_LABELS, type Model } from '../model';

interface ModelCardProps {
  model: Model;
}

/**
 * Given, from TP7. One model of the catalogue.
 *
 * TODO step 3: the name becomes a link to the page of the model, /models/<id>.
 */
export const ModelCard = ({ model }: ModelCardProps) => {
  return (
    <article className="card">
      <header className="card-header">
        <h2 className="card-title">{model.name}</h2>
        <span className="badge">{TASK_LABELS[model.task]}</span>
      </header>
      <p className="card-org">{model.org}</p>
      <dl className="card-stats">
        <div>
          <dt>Paramètres</dt>
          <dd>{formatParameters(model.parameters)}</dd>
        </div>
        <div>
          <dt>Téléchargements</dt>
          <dd>{formatDownloads(model.downloads)}</dd>
        </div>
      </dl>
      {model.license && <p className="card-license">Licence {model.license}</p>}
    </article>
  );
};
