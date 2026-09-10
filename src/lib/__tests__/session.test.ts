import type * as SessionModule from '../session';
import type * as SecureStoreModule from 'expo-secure-store';

// session.ts keeps module-level state, so reload it (and the SecureStore mock
// it binds to) per test.
function fresh(): { s: typeof SessionModule; store: jest.Mocked<typeof SecureStoreModule> } {
  jest.resetModules();
  return {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    s: require('../session'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    store: require('expo-secure-store'),
  };
}

describe('session', () => {
  it('starts with no token', () => {
    const { s } = fresh();
    expect(s.getToken()).toBeNull();
    expect(s.isSessionInitialized()).toBe(false);
  });

  it('setToken persists to SecureStore and notifies listeners', () => {
    const { s, store } = fresh();
    const seen: (string | null)[] = [];
    s.subscribe(() => seen.push(s.getToken()));

    s.setToken('jwt-123');

    expect(s.getToken()).toBe('jwt-123');
    expect(seen).toEqual(['jwt-123']);
    expect(store.setItemAsync).toHaveBeenCalledWith('owner_jwt', 'jwt-123');
  });

  it('clearToken wipes memory + storage', () => {
    const { s, store } = fresh();
    s.setToken('jwt-123');
    s.clearToken();
    expect(s.getToken()).toBeNull();
    expect(store.deleteItemAsync).toHaveBeenCalledWith('owner_jwt');
  });

  it('initSession hydrates the token from storage exactly once', async () => {
    const { s, store } = fresh();
    (store.getItemAsync as jest.Mock).mockResolvedValueOnce('stored-jwt');

    await s.initSession();
    expect(s.getToken()).toBe('stored-jwt');
    expect(s.isSessionInitialized()).toBe(true);

    (store.getItemAsync as jest.Mock).mockClear();
    await s.initSession(); // no-op the second time
    expect(store.getItemAsync).not.toHaveBeenCalled();
  });

  it('unsubscribe stops further notifications', () => {
    const { s } = fresh();
    let calls = 0;
    const off = s.subscribe(() => { calls += 1; });
    s.setToken('a');
    off();
    s.setToken('b');
    expect(calls).toBe(1);
  });
});
