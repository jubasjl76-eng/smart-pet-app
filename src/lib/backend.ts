/**
 * Discover the owner backend on :3000 only.
 * Candidates: EXPO_PUBLIC_API_URL, localhost, Android emulator 10.0.2.2.
 * Does not probe :3002/:3003 or a cloud fallback.
 */

import axios from 'axios';

function envUrl(): string | undefined {
  const raw = process.env.EXPO_PUBLIC_API_URL;
  if (!raw) return undefined;
  return raw.replace(/\/$/, '');
}

function candidates(): string[] {
  const urls = [envUrl(), 'http://localhost:3000', 'http://10.0.2.2:3000', 'http://127.0.0.1:3000'].filter(
    (u): u is string => Boolean(u)
  );
  return [...new Set(urls)];
}

let cached: string | null = null;
let inflight: Promise<string> | null = null;

export async function discoverBackend(): Promise<string> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = (async () => {
    const urls = candidates();
    for (const url of urls) {
      try {
        const res = await axios.get(`${url}/health`, { timeout: 3000 });
        if (res.status >= 200 && res.status < 300) {
          cached = url;
          return url;
        }
      } catch {
        // try next candidate
      }
    }
    cached = urls[0] || 'http://localhost:3000';
    return cached;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function getCachedBackendUrl(): string | null {
  return cached;
}
