import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchModels } from './api';
import { ModelList } from './components/ModelList';
import { TaskFilter } from './components/TaskFilter';
import type { Task } from './model';

const App = () => {
  const [task, setTask] = useState<Task | undefined>(undefined);

  // The key plays the role of the dependency array: a new task, a new query.
  // The three states, the stale answers, the cache: TanStack Query handles them.
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['models', task],
    queryFn: () => fetchModels(task),
  });

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">ModelZoo</h1>
        <p className="app-tagline">Le catalogue des modèles d'IA</p>
      </header>

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
    </main>
  );
};

export default App;
