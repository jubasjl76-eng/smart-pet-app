import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../constants';

class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.API_KEY,
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }
}

// Feeder API Service
export const feederApi = new ApiService(API_CONFIG.FEEDER_BASE_URL);

// Water Dispenser API Service
export const waterApi = new ApiService(API_CONFIG.WATER_BASE_URL);

// Health Check
export const checkHealth = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_CONFIG.FEEDER_BASE_URL.replace('/api', '')}/health`);
    return true;
  } catch {
    return false;
  }
};
