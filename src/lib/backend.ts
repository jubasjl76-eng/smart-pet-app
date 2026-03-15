/**
 * Backend Client with Automatic Discovery
 * Tries local backend first, then falls back to cloud
 */

import axios, { AxiosInstance } from 'axios';

const LOCAL_BACKEND_URLS = [
  'http://localhost:3000',
  'http://10.0.2.2:3000', // Android emulator
  'http://127.0.0.1:3000',
  'http://local-pet-backend:3000',
];

const CLOUD_BACKEND_URL = 'https://api.petsmart.example.com'; // Configure for production

interface BackendConfig {
  baseURL: string;
  isLocal: boolean;
}

class BackendClient {
  private client: AxiosInstance;
  private baseURL: string = CLOUD_BACKEND_URL;
  private isLocal: boolean = false;
  private checked: boolean = false;

  constructor() {
    this.client = axios.create({
      timeout: 10000,
    });
  }

  async discover(): Promise<BackendConfig> {
    if (this.checked) {
      return { baseURL: this.baseURL, isLocal: this.isLocal };
    }

    // Try local backends first
    for (const url of LOCAL_BACKEND_URLS) {
      try {
        const response = await this.client.get(`${url}/health`, { 
          timeout: 3000
        });
        
        if (response.status === 200) {
          console.log(`[Backend] Using local backend: ${url}`);
          this.baseURL = url;
          this.isLocal = true;
          this.updateClient();
          this.checked = true;
          return { baseURL: this.baseURL, isLocal: this.isLocal };
        }
      } catch {
        // Try next URL
      }
    }

    // Fall back to cloud
    console.log(`[Backend] Using cloud backend: ${CLOUD_BACKEND_URL}`);
    this.baseURL = CLOUD_BACKEND_URL;
    this.isLocal = false;
    this.updateClient();
    this.checked = true;
    return { baseURL: this.baseURL, isLocal: this.isLocal };
  }

  private updateClient(): void {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  isUsingLocal(): boolean {
    return this.isLocal;
  }

  // API methods
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const response = await this.client.get(endpoint, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const response = await this.client.post(endpoint, data, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const response = await this.client.put(endpoint, data, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return response.data;
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const response = await this.client.delete(endpoint, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return response.data;
  }
}

export const backend = new BackendClient();
export default backend;
