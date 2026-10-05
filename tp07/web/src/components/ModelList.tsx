import { ModelCard } from './ModelCard';
import type { Model } from '../model';

interface ModelListProps {
  models: Model[];
}

export const ModelList = ({ models }: ModelListProps) => {
  if (models.length === 0) {
    return <p>Aucun modèle pour ce filtre.</p>;
  }

  return (
    <ul className="model-list">
      {models.map((model) => (
        <li key={model.id}>
          <ModelCard model={model} />
        </li>
      ))}
    </ul>
  );
};