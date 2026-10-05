import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

/** One client for the whole app: it holds the cache of every query. A failed request is retried once. */
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

/**
 * Given, but for one line. Mounts the React tree in the <div id="root"> of
 * index.html. Around <App />, the providers: each one gives something to
 * every component below it. QueryClientProvider gives the cache of the
 * requests, from TP7.
 *
 * TODO step 2: a <BrowserRouter> around it, for the current URL.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
