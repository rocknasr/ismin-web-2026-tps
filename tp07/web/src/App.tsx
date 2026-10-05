import { useState } from 'react';
import { ModelList } from './components/ModelList';
import { TaskFilter } from './components/TaskFilter';
import { MOCK_MODELS } from './models.mock';
import type { Task } from './model';

const App = () => {
  const [task, setTask] = useState<Task | undefined>(undefined);

  const filteredModels = task === undefined
    ? MOCK_MODELS
    : MOCK_MODELS.filter((model) => model.task === task);

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">ModelZoo</h1>
        <p className="app-tagline">Le catalogue des modèles d'IA</p>
      </header>

      <TaskFilter value={task} onChange={setTask} />

      <ModelList models={filteredModels} />
    </main>
  );
};

export default App;