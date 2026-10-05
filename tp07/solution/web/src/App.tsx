import { useEffect, useState } from 'react';
import { fetchModels } from './api';
import { ModelList } from './components/ModelList';
import { TaskFilter } from './components/TaskFilter';
import type { Model, Task } from './model';

type Status = 'loading' | 'error' | 'ready';

const App = () => {
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [models, setModels] = useState<Model[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');

  // Runs after the render, and again each time `task` changes.
  useEffect(() => {
    // Set to true when the effect is cleaned up: a newer request has started,
    // or the component is gone. The answer of this one is then ignored.
    let ignore = false;

    setStatus('loading');
    fetchModels(task)
      .then((data) => {
        if (ignore) return;
        setModels(data);
        setStatus('ready');
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : String(err));
        setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [task]);

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">ModelZoo</h1>
        <p className="app-tagline">Le catalogue des modèles d'IA</p>
      </header>

      <TaskFilter value={task} onChange={setTask} />

      {status === 'loading' && (
        <p className="status" role="status">
          Chargement…
        </p>
      )}
      {status === 'error' && (
        <div className="error" role="alert">
          <span>Impossible de charger le catalogue&nbsp;: {error}</span>
        </div>
      )}
      {status === 'ready' && <ModelList models={models} />}
    </main>
  );
};

export default App;
