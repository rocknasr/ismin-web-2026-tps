import { createContext, useContext, useState, type ReactNode } from 'react';
import type { JwtPayload } from './jwt';

/** Where the token is kept: DevTools → Application → Local Storage, under this key. */
export const TOKEN_KEY = 'token';

/** What every component under <AuthProvider> can ask for, with useAuth(). */
export interface Auth {
  /** The raw token, for the Authorization header. null: logged out. */
  token: string | null;
  /** Who is logged in, read from the payload of the token. null: logged out. */
  user: JwtPayload | null;
  /** Asks the API for a token and keeps it. Lets the ApiError through: 401 for a wrong password. */
  login: (username: string, password: string) => Promise<void>;
  /** Forgets the token. */
  logout: () => void;
}

/**
 * Given. A context shares a value with every component below its provider,
 * however deep, without passing it down as props through every level.
 */
const AuthContext = createContext<Auth | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * The logged-in user, for the whole app: main.tsx puts it around <App />.
 *
 * The token lives in two places. In a state, so that React redraws the page
 * when it changes. In localStorage, so that it survives a reload: the state
 * starts from what localStorage holds.
 *
 * TODO step 2: `user`, `login` and `logout`. You will need `setToken`, and
 * the `login` of api.ts: `import * as api from '../api'`, then `api.login(…)`,
 * since this component has a `login` of its own.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token] = useState(() => localStorage.getItem(TOKEN_KEY));

  const user: JwtPayload | null = null; // TODO step 2: decodePayload, when there is a token

  const login: Auth['login'] = async () => {
    throw new Error('TODO step 2: login');
  };

  const logout: Auth['logout'] = () => {
    throw new Error('TODO step 2: logout');
  };

  return <AuthContext value={{ token, user, login, logout }}>{children}</AuthContext>;
};

/** Given. The logged-in user, from any component under <AuthProvider>. */
export const useAuth = (): Auth => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return auth;
};
