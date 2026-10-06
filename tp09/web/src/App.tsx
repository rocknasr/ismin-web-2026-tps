import { Route, Routes } from 'react-router';
import { RequireAuth } from './auth/RequireAuth';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { LoginPage } from './pages/LoginPage';
import { ModelPage } from './pages/ModelPage';
import { NewModelPage } from './pages/NewModelPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * The frame of every page: the header, then the page of the current URL.
 * The routes of TP8, plus /login and /models/new, the latter for the
 * logged-in only. /models/new is a route of its own, so the :id of
 * /models/:id never catches "new".
 */
const App = () => {
  return (
    <main className="app">
      <Header />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/models/new"
          element={
            <RequireAuth>
              <NewModelPage />
            </RequireAuth>
          }
        />
        <Route path="/models/:id" element={<ModelPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};

export default App;
