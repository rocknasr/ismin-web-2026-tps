import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ApiError } from '../api';
import { useAuth } from '../auth/AuthProvider';

/**
 * The login page, at /login. A controlled form: a state per field. Once
 * logged in, it goes back to the page RequireAuth came from,
 * `location.state?.from`, or to the catalogue.
 */
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Set by RequireAuth: the page that was asked for before the login.
  const from = (location.state as { from?: string } | null)?.from;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate(from ?? '/', { replace: true });
    } catch (error) {
      // Only a 401 means a wrong password: anything else (API down, CORS, 429…) says what happened.
      setError(
        error instanceof ApiError && error.status === 401
          ? 'Identifiant ou mot de passe incorrect.'
          : `Impossible de se connecter : ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  return (
    <section className="page form-page">
      <h2>Connexion</h2>
      {from && <p className="hint">Cette page est réservée aux utilisateurs connectés&nbsp;: connectez-vous pour y accéder.</p>}

      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="login-username">Identifiant</label>
          <input
            id="login-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && (
          <div className="error form-error" role="alert">
            <p>{error}</p>
          </div>
        )}

        <button className="button" type="submit">
          Se connecter
        </button>
      </form>

      <p className="hint">Deux comptes&nbsp;: alice, administratrice, et bob. Le mot de passe&nbsp;: secret.</p>
    </section>
  );
};
