// Feeder Types
export interface Feeder {
  id: string;
  name: string;
  foodLevel: number;
  isLowFood: boolean;
  wifiRssi: number;
  uptimeMs: number;
  lastSeen: string;
  createdAt: string;
}

export interface FeederStatus {
  feeder_id: string;
  food_level: number;
  is_low_food: boolean;
  wifi_rssi: number;
  uptime_ms: number;
}

export interface Schedule {
  id: string;
  feederId: string;
  hour: number;
  minute: number;
  enabled: boolean;
  createdAt: string;
}

export interface FeedEvent {
  id: string;
  feederId: string;
  type: 'scheduled' | 'manual' | 'api';
  timestamp: string;
  success: boolean;
  message?: string;
}

// Water Dispenser Types
export interface WaterDevice {
  id: string;
  name: string;
  waterLevel: number;
  isLowWater: boolean;
  tds: number;
  temperature: number;
  waterQuality: number;
  wifiRssi: number;
  uptimeMs: number;
  lastSeen: string;
  createdAt: string;
}

export interface WaterStatus {
  device_id: string;
  water_level: number;
  is_low_water: boolean;
  tds: number;
  temperature: number;
  water_quality: number;
  wifi_rssi: number;
  uptime_ms: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime?: number;
}
