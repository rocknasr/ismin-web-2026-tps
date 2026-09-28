import type { Model } from '../model';

interface ModelListProps {
  models: Model[];
}

/**
 * TODO step 3. The <ul> of the mockup: one <li> per model, a ModelCard in each,
 * and a key. No model: the text « Aucun modèle pour ce filtre. », not an empty list.
 */
export const ModelList = ({ models }: ModelListProps) => {
  return <p>TODO: {models.length} models</p>;
};
