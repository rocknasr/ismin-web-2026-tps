import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

/**
 * One client for the whole app: it holds the cache of every query. A failed
 * request is retried once, not three times: the error shows sooner.
 */
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
