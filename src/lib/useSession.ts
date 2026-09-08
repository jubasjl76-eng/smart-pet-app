import { useEffect, useState } from 'react';
import { getToken, subscribe, initSession, isSessionInitialized } from './session';

export function useSession() {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [ready, setReady] = useState(isSessionInitialized());

  useEffect(() => {
    if (!isSessionInitialized()) {
      initSession().then(() => {
        setTokenState(getToken());
        setReady(true);
      });
    }
  }, []);

  useEffect(() => subscribe(() => setTokenState(getToken())), []);

  return {
    token,
    isLoggedIn: Boolean(token),
    ready,
  };
}
