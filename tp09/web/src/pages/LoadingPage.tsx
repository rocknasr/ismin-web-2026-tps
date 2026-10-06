/**
 * The page shown while the API does not answer: a turning circle and a
 * message. Before the first check, the API may well be up: "Chargement…",
 * as the loading page of index.html. Once it is known to be down: the error.
 *
 * The same markup as the loading page of index.html, whose inline <style>
 * holds the `splash-*` classes: React takes over from it without anything
 * moving on the screen.
 */
export const LoadingPage = ({ error = false }: { error?: boolean }) => {
  return (
    <div className="splash" role="status" aria-live="polite">
      <div className="splash-spinner" aria-hidden="true">
        <div className="splash-arc"></div>
      </div>
      {error ? (
        <>
          <p className="splash-title">System error</p>
          <p className="splash-text">We will be back in a few minutes.</p>
        </>
      ) : (
        <>
          <p className="splash-title">ModelZoo</p>
          <p className="splash-text">Chargement…</p>
        </>
      )}
    </div>
  );
};
