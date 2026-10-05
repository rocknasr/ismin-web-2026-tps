import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { fetchModels } from '../api';
import { ModelList } from '../components/ModelList';
import { TaskFilter } from '../components/TaskFilter';
import { TASKS, type Task } from '../model';

/**
 * The catalogue, at /. The filter lives in the URL, /?task=translation, not in
 * a useState: it survives the Back button, and the link can be shared.
 */
export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is text typed by anyone: only a known task is kept, anything else means "no filter".
  const param = searchParams.get('task');
  const task: Task | undefined = TASKS.find((known) => known === param);

  // Choosing a filter writes it in the URL; "all tasks" removes it.
  const setTask = (next: Task | undefined) => {
    setSearchParams(next ? { task: next } : {});
  };

  // The key plays the role of the dependency array: a new task, a new query.
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['models', task],
    queryFn: () => fetchModels(task),
  });

  return (
    <>
      <TaskFilter value={task} onChange={setTask} />

      {isPending && (
        <p className="status" role="status">
          Chargement…
        </p>
      )}
      {isError && (
        <div className="error" role="alert">
          <span>Impossible de charger le catalogue&nbsp;: {error.message}</span>
        </div>
      )}
      {data && <ModelList models={data} />}
    </>
  );
};