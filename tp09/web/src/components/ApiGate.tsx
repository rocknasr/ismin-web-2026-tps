import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { isApiUp, onApiDown } from '../api';
import { LoadingPage } from '../pages/LoadingPage';

/** How often the API is asked if it is up, whether it answers or not. */
const CHECK_EVERY_MS = 2_000;

/** Not checked yet, answering, or not answering. */
type ApiState = 'checking' | 'up' | 'down';

/**
 * Shows the loading page until the API answers, then `children`. The API is
 * checked every 2 s, and any request that cannot reach it says so at once:
 * the error page comes back without waiting for the next check. It shows
 * over the app rather than instead of it, so a form being filled keeps what
 * was typed. When the API is back, every query is fetched again.
 */
export const ApiGate = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<ApiState>('checking');
  const [wasEverUp, setWasEverUp] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let wasUp = false;

    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(check, CHECK_EVERY_MS);
    };

    const check = async () => {
      const ok = await isApiUp();
      if (cancelled) return;
      if (ok && !wasUp) void queryClient.invalidateQueries();
      wasUp = ok;
      setState(ok ? 'up' : 'down');
      if (ok) setWasEverUp(true);
      schedule();
    };

    // A request failed: down now, and checked again from now on.
    const stopListening = onApiDown(() => {
      wasUp = false;
      setState('down');
      schedule();
    });

    void check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      stopListening();
    };
  }, [queryClient]);

  if (!wasEverUp) return <LoadingPage error={state === 'down'} />;

  return (
    <>
      {children}
      {state === 'down' && <LoadingPage error />}
    </>
  );
};
