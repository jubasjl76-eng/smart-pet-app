/**
 * In-memory owner JWT session. Not persisted; no secrets committed.
 */

type Listener = () => void;

let token: string | null = null;
const listeners = new Set<Listener>();

export function getToken(): string | null {
  return token;
}

export function setToken(next: string | null): void {
  token = next;
  listeners.forEach((fn) => fn());
}

export function clearToken(): void {
  setToken(null);
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
