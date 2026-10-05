import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import './styles.css';

/** One client for the whole app: it holds the cache of every query. A failed request is retried once. */
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

/**
 * Mounts the React tree in the <div id="root"> of index.html. Around <App />,
 * the providers: each one gives something to every component below it.
 *
 *   BrowserRouter         the current URL, read from and written to the address bar
 *   QueryClientProvider   the cache of the requests, from TP7
 *
 * The router is here and not in App: the tests put App in a MemoryRouter.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
