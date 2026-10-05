/**
 * The page of any URL that no route knows.
 *
 * TODO step 2: the route that shows it, `*`.
 * TODO step 3: the <a href> becomes a <Link to>.
 */
export const NotFoundPage = () => {
  return (
    <section className="page not-found">
      <h2>Page introuvable</h2>
      <p>Cette adresse ne correspond à aucune page du catalogue.</p>
      <a href="/">Retour au catalogue</a>
    </section>
  );
};
