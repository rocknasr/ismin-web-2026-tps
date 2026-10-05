/**
 * TODO step 3. The login page, at /login: its route goes in App.tsx.
 *
 * Below, the mockup. Make the form controlled: a state per field, `value` and
 * `onChange` on each input. On submit, `preventDefault`, then the `login` of
 * useAuth(). Once logged in, go back to the page RequireAuth came from,
 * `location.state?.from`, or to the catalogue. A wrong password: the message
 * "Identifiant ou mot de passe incorrect." in a `role="alert"`.
 */
export const LoginPage = () => {
  return (
    <section className="page form-page">
      <h2>Connexion</h2>

      <form className="form">
        <div className="field">
          <label htmlFor="login-username">Identifiant</label>
          <input id="login-username" name="username" autoComplete="username" />
        </div>

        <div className="field">
          <label htmlFor="login-password">Mot de passe</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" />
        </div>

        <button className="button" type="submit">
          Se connecter
        </button>
      </form>

      <p className="hint">Deux comptes&nbsp;: alice, administratrice, et bob. Le mot de passe&nbsp;: secret.</p>
    </section>
  );
};
