/**
 * Persistent storage for owner session (JWT) and local fallback data.
 * Uses expo-secure-store for JWT, AsyncStorage for non-sensitive data.
 * Never persists MQTT device secrets.
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'owner_jwt';
const PET_NAME_KEY = 'pet_name_fallback';

export async function loadToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    // SecureStore may fail on some platforms; token remains in-memory only
  }
}

export async function clearStoredToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function loadPetName(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PET_NAME_KEY);
  } catch {
    return null;
  }
}

export async function savePetName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(PET_NAME_KEY, name);
  } catch {
    // ignore storage failures for pet name
  }
}
