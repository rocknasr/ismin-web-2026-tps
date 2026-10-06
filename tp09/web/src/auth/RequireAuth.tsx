import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from './AuthProvider';

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Guards a page. Logged in, it shows `children`. Logged out, it sends to
 * /login, and remembers the page that was asked for in the state of the
 * navigation, so that the login page can come back to it.
 */
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};
