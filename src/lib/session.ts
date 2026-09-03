/**
 * Owner JWT session with persistence across process restarts.
 * JWT is stored in expo-secure-store. MQTT device secrets are never persisted.
 */

import { loadToken, saveToken, clearStoredToken } from './storage';

type Listener = () => void;

let token: string | null = null;
let initialized = false;
const listeners = new Set<Listener>();

export function getToken(): string | null {
  return token;
}

export function isSessionInitialized(): boolean {
  return initialized;
}

export async function initSession(): Promise<void> {
  if (initialized) return;
  const stored = await loadToken();
  if (stored) {
    token = stored;
    listeners.forEach((fn) => fn());
  }
  initialized = true;
}

export function setToken(next: string | null): void {
  token = next;
  if (next) {
    saveToken(next).catch(() => {});
  } else {
    clearStoredToken().catch(() => {});
  }
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
