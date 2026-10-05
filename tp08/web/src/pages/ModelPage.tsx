/**
 * The page of one model, at /models/:id.
 *
 * TODO step 3: the <a href> becomes a <Link to>.
 *
 * TODO step 4. Below, the mockup: written by hand, for Mistral. Make it show
 * the model of the URL.
 *   - the id in the URL: useParams
 *   - the model: useQuery, with the key ['model', id] and fetchModel(id)
 *   - the three states, like CatalogPage. A 404 of the API: "Modèle introuvable."
 *   - the numbers with format.ts, the task with TASK_LABELS
 *   - no licence: "Non précisée". No createdBy: no "Ajouté par" line
 */
export const ModelPage = () => {
  return (
    <section className="page">
      <a className="back" href="/">
        ← Retour au catalogue
      </a>

      <article className="detail">
        <header className="detail-header">
          <h2 className="detail-title">Mistral-7B-Instruct-v0.3</h2>
          <span className="badge">Génération de texte</span>
        </header>

        <dl className="detail-fields">
          <div>
            <dt>Identifiant</dt>
            <dd>mistral-7b-instruct-v0-3</dd>
          </div>
          <div>
            <dt>Organisation</dt>
            <dd>mistralai</dd>
          </div>
          <div>
            <dt>Paramètres</dt>
            <dd>7,25 milliards</dd>
          </div>
          <div>
            <dt>Téléchargements</dt>
            <dd>1 420 000</dd>
          </div>
          <div>
            <dt>Licence</dt>
            <dd>apache-2.0</dd>
          </div>
          <div>
            <dt>Ajouté par</dt>
            <dd>alice</dd>
          </div>
        </dl>
      </article>
    </section>
  );
};
