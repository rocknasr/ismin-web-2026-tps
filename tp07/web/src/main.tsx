import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

/**
 * Given. Mounts the React tree in the <div id="root"> of index.html.
 * StrictMode runs every effect twice in development, on purpose: it makes
 * the effects that forget to clean up visible early.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
