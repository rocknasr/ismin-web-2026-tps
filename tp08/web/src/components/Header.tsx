import { Link } from 'react-router';

/**
 * The top of every page: the title, which leads back to the catalogue.
 *
 * A <Link> changes the URL without reloading the page: React keeps running and
 * the cache of the requests is kept. An <a href> would ask the server for a whole
 * new page.
 */
export const Header = () => {
  return (
    <header className="app-header">
      <div>
        <h1 className="app-title">
          <Link to="/">ModelZoo</Link>
        </h1>
        <p className="app-tagline">Le catalogue des modèles d'IA</p>
      </div>
    </header>
  );
};