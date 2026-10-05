import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';

/**
 * The frame of every page: the header, then the page of the current URL.
 *
 * TODO step 2: the routes. For now, the catalogue, whatever the URL.
 *
 *   /              CatalogPage
 *   /models/:id    ModelPage
 *   anything else  NotFoundPage
 */
const App = () => {
  return (
    <main className="app">
      <Header />
      <CatalogPage />
    </main>
  );
};

export default App;
