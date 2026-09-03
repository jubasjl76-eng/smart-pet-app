import { useEffect, useState } from 'react';
import { getToken, subscribe } from './session';

export function useSession() {
  const [token, setTokenState] = useState<string | null>(getToken());

  useEffect(() => subscribe(() => setTokenState(getToken())), []);

  return {
    token,
    isLoggedIn: Boolean(token),
  };
}
