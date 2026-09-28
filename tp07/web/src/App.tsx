/**
 * The mockup: the page as a designer would hand it over, static HTML written
 * as JSX, and nothing else. `npm run dev`, then localhost:5173.
 *
 * You turn it into components, step by step:
 *   step 2  one card    → <ModelCard model={…} />
 *   step 3  the <ul>    → <ModelList models={MOCK_MODELS} />
 *   step 4  the <nav>   → <TaskFilter value={task} onChange={setTask} />, the state lives here
 *   step 6  MOCK_MODELS → the API
 */
const App = () => {
  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">ModelZoo</h1>
        <p className="app-tagline">Le catalogue des modèles d'IA</p>
      </header>

      <nav className="filters" aria-label="Filtrer par tâche">
        <button className="filter" aria-pressed="true">Toutes</button>
        <button className="filter" aria-pressed="false">Génération de texte</button>
        <button className="filter" aria-pressed="false">Traduction</button>
        <button className="filter" aria-pressed="false">Classification d'images</button>
        <button className="filter" aria-pressed="false">Reconnaissance vocale</button>
      </nav>

      <ul className="model-list">
        <li>
          <article className="card">
            <header className="card-header">
              <h2 className="card-title">Mistral-7B-Instruct-v0.3</h2>
              <span className="badge">Génération de texte</span>
            </header>
            <p className="card-org">mistralai</p>
            <dl className="card-stats">
              <div>
                <dt>Paramètres</dt>
                <dd>7,25 milliards</dd>
              </div>
              <div>
                <dt>Téléchargements</dt>
                <dd>1 420 000</dd>
              </div>
            </dl>
            <p className="card-license">Licence apache-2.0</p>
          </article>
        </li>
        <li>
          <article className="card">
            <header className="card-header">
              <h2 className="card-title">t5-base</h2>
              <span className="badge">Traduction</span>
            </header>
            <p className="card-org">google-t5</p>
            <dl className="card-stats">
              <div>
                <dt>Paramètres</dt>
                <dd>223 millions</dd>
              </div>
              <div>
                <dt>Téléchargements</dt>
                <dd>2 100 000</dd>
              </div>
            </dl>
          </article>
        </li>
        <li>
          <article className="card">
            <header className="card-header">
              <h2 className="card-title">whisper-large-v3</h2>
              <span className="badge">Reconnaissance vocale</span>
            </header>
            <p className="card-org">openai</p>
            <dl className="card-stats">
              <div>
                <dt>Paramètres</dt>
                <dd>1,55 milliards</dd>
              </div>
              <div>
                <dt>Téléchargements</dt>
                <dd>4 100 000</dd>
              </div>
            </dl>
          </article>
        </li>
      </ul>
    </main>
  );
};

export default App;
