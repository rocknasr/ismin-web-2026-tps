import { Route, Routes } from 'react-router';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { ModelPage } from './pages/ModelPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * The frame of every page: the header, then the page of the current URL.
 *
 *   /              CatalogPage
 *   /models/:id    ModelPage
 *   anything else  NotFoundPage
 */
const App = () => {
  return (
    <main className="app">
      <Header />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/models/:id" element={<ModelPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};

export default App;
