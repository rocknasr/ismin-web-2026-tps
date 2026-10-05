import { Link } from 'react-router';

/**
 * The top of every page: the title, back to the catalogue, and the links.
 *
 * TODO step 4: logged in, the username and a "Se déconnecter" button, in
 * place of the "Se connecter" link.
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

      <nav className="app-nav" aria-label="Navigation principale">
        <Link to="/models/new">Ajouter un modèle</Link>
        <Link to="/login">Se connecter</Link>
      </nav>
    </header>
  );
};
