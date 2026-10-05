import { Link } from 'react-router';

/**
 * The top of every page: the title, which leads back to the catalogue.
 *
 * <Link> changes the URL without asking the server for a new page: React
 * keeps its state, TanStack Query keeps its cache.
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
