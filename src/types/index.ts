export interface Device {
  id: string;
  name: string;
  foodLevel: number;
  status: string;
}

export interface Schedule {
  id: string;
  deviceId?: string;
  hour: number;
  minute: number;
  enabled: boolean;
}

export interface User {
  id?: string;
  email?: string;
  name?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
