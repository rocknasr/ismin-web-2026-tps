import type { Model } from '../model';

interface ModelCardProps {
  model: Model;
}

/**
 * TODO step 2. One card of the mockup, with the data of `model` instead of
 * the text written by hand. The markup is in App.tsx: copy one <article>.
 * `format.ts` writes the numbers, TASK_LABELS the task. No licence, no line.
 */
export const ModelCard = ({ model }: ModelCardProps) => {
  return <article className="card">TODO: {model.name}</article>;
};
