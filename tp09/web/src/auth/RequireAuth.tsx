import type { ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * TODO step 5. Guards a page. Logged in, it shows `children`. Logged out, it
 * sends to /login, and remembers the page that was asked for in the state of
 * the navigation, so that the login page can come back to it:
 *
 *   <Navigate to="/login" replace state={{ from: location.pathname }} />
 *
 * For now it guards nothing.
 */
export const RequireAuth = ({ children }: RequireAuthProps) => {
  return children;
};
