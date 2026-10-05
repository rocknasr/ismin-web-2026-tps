/**
 * The top of every page: the title, which leads back to the catalogue.
 *
 * TODO step 3: the <a href> becomes a <Link to>. An <a> asks the server for a
 * whole new page: React starts again from zero, the cache of the requests is lost.
 */
export const Header = () => {
  return (
    <header className="app-header">
      <div>
        <h1 className="app-title">
          <a href="/">ModelZoo</a>
        </h1>
        <p className="app-tagline">Le catalogue des modèles d'IA</p>
      </div>
    </header>
  );
};
