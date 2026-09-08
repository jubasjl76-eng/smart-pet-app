/**
 * Owner-app API client.
 * JWT Bearer against the discovered :3000 backend only. No X-API-Key, no :3002/:3003.
 */

import axios, { AxiosInstance } from 'axios';
import { discoverBackend } from '../lib/backend';
import { getToken, setToken, clearToken } from '../lib/session';
import { loadPetName, savePetName } from '../lib/storage';
import type { Device, Schedule, User } from '../types';

function unwrapList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    for (const key of ['devices', 'schedules', 'data', 'items', 'results']) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
  }
  return [];
}

function asRecord(data: unknown): Record<string, unknown> {
  if (data && typeof data === 'object') return data as Record<string, unknown>;
  return {};
}

export function normalizeDevice(raw: unknown): Device {
  const r = asRecord(raw);
  const nested = asRecord(r.device);
  const src = Object.keys(nested).length ? { ...r, ...nested } : r;
  const id = String(src.id ?? src._id ?? src.deviceId ?? '');
  const foodLevelRaw = src.foodLevel ?? src.food_level;
  let foodLevel: number | null = null;
  if (typeof foodLevelRaw === 'number') {
    foodLevel = foodLevelRaw;
  } else if (foodLevelRaw != null && foodLevelRaw !== '') {
    const parsed = Number(foodLevelRaw);
    if (!Number.isNaN(parsed)) {
      foodLevel = parsed;
    }
  }
  let status: string;
  if (typeof src.status === 'string' && src.status.length) {
    status = src.status;
  } else if (src.isOnline === true) {
    status = 'online';
  } else {
    status = 'offline';
  }
  return {
    id,
    name: String(src.name ?? 'Feeder'),
    foodLevel,
    status,
  };
}

export function isDeviceOffline(device: Device): boolean {
  return device.status !== 'online';
}

export function isFoodLow(device: Device): boolean {
  return typeof device.foodLevel === 'number' && device.foodLevel < 20;
}

export function normalizeSchedule(raw: unknown): Schedule {
  const r = asRecord(raw);
  const time = asRecord(r.time);
  return {
    id: String(r.id ?? r._id ?? ''),
    deviceId: r.deviceId != null || r.device_id != null || r.feederId != null
      ? String(r.deviceId ?? r.device_id ?? r.feederId)
      : undefined,
    hour: Number(r.hour ?? time.hour ?? 0) || 0,
    minute: Number(r.minute ?? time.minute ?? 0) || 0,
    enabled: r.enabled !== false,
  };
}

function isFeedAckSuccess(status: number, data: unknown): boolean {
  if (status < 200 || status >= 300) return false;
  const r = asRecord(data);
  if (r.success === false) return false;
  if (r.acked === false) return false;
  return true;
}

function errorMessage(err: unknown, fallback: string): string {
  const anyErr = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return anyErr?.response?.data?.message || anyErr?.response?.data?.error || anyErr?.message || fallback;
}

let client: AxiosInstance | null = null;
let clientBase: string | null = null;

async function getClient(): Promise<AxiosInstance> {
  const baseURL = await discoverBackend();
  if (!client || clientBase !== baseURL) {
    client = axios.create({
      baseURL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });
    client.interceptors.request.use((config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    clientBase = baseURL;
  }
  return client;
}

export const api = {
  async login(email: string, password: string): Promise<User> {
    const c = await getClient();
    const res = await c.post('/api/auth/login', { email, password });
    const body = asRecord(res.data);
    const user = asRecord(body.user);
    const token = String(
      body.token ?? body.accessToken ?? body.access_token ?? body.jwt ?? user.token ?? ''
    );
    if (!token) {
      throw new Error('Login succeeded but no token was returned');
    }
    setToken(token);
    return {
      id: user.id != null ? String(user.id) : undefined,
      email: String(user.email ?? body.email ?? email),
      name: user.name != null ? String(user.name) : undefined,
    };
  },

  async me(): Promise<User | null> {
    const c = await getClient();
    const res = await c.get('/api/auth/me');
    const body = asRecord(res.data);
    const user = Object.keys(asRecord(body.user)).length ? asRecord(body.user) : body;
    return {
      id: user.id != null ? String(user.id) : undefined,
      email: user.email != null ? String(user.email) : undefined,
      name: user.name != null ? String(user.name) : undefined,
    };
  },

  logout(): void {
    clearToken();
  },

  async getDevices(): Promise<Device[]> {
    const c = await getClient();
    const res = await c.get('/api/devices');
    return unwrapList(res.data).map(normalizeDevice).filter((d) => d.id);
  },

  async claimDevice(code: string): Promise<Device | Record<string, unknown>> {
    const c = await getClient();
    const res = await c.post('/api/devices/claim', { code });
    const body = asRecord(res.data);
    // Ignore MQTT password if the backend returns one.
    const rest = { ...body };
    delete rest.mqttPassword;
    delete rest.mqtt_password;
    delete rest.mqttPass;
    const deviceRaw = rest.device ?? rest;
    try {
      const device = normalizeDevice(deviceRaw);
      if (device.id) return device;
    } catch {
      // fall through
    }
    return rest;
  },

  async feedNow(deviceId: string): Promise<void> {
    const c = await getClient();
    const res = await c.post(`/api/devices/${deviceId}/feed`);
    if (!isFeedAckSuccess(res.status, res.data)) {
      const body = asRecord(res.data);
      throw new Error(String(body.message ?? body.error ?? 'Feed was not acknowledged'));
    }
  },

  async getSchedules(deviceId?: string): Promise<Schedule[]> {
    const c = await getClient();
    const res = await c.get('/api/schedules', { params: deviceId ? { deviceId } : undefined });
    return unwrapList(res.data).map(normalizeSchedule).filter((s) => s.id);
  },

  async createSchedule(input: { deviceId: string; hour: number; minute: number }): Promise<void> {
    const c = await getClient();
    await c.post('/api/schedules', { ...input, enabled: true });
  },

  async toggleSchedule(id: string, enabled: boolean): Promise<void> {
    const c = await getClient();
    await c.post(`/api/schedules/${id}/toggle`, { enabled });
  },

  async deleteSchedule(id: string): Promise<void> {
    const c = await getClient();
    await c.delete(`/api/schedules/${id}`);
  },

  async getPet(): Promise<{ name?: string; fromLocal?: boolean } | null> {
    try {
      const c = await getClient();
      const res = await c.get('/api/pet');
      const body = asRecord(res.data);
      const pet = asRecord(body.pet);
      const name = String(pet.name ?? body.name ?? '');
      if (name) {
        savePetName(name).catch(() => {});
      }
      return { name: name || undefined };
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        const local = await loadPetName();
        return local ? { name: local, fromLocal: true } : null;
      }
      throw err;
    }
  },

  async putPet(name: string): Promise<{ name?: string; fromLocal?: boolean } | null> {
    try {
      const c = await getClient();
      const res = await c.put('/api/pet', { name });
      const body = asRecord(res.data);
      const savedName = String(asRecord(body.pet).name ?? body.name ?? name);
      savePetName(savedName).catch(() => {});
      return { name: savedName };
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        await savePetName(name);
        return { name, fromLocal: true };
      }
      throw err;
    }
  },

  async loadLocalPetName(): Promise<string | null> {
    return loadPetName();
  },
};

export { errorMessage };
