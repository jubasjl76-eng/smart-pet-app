/**
 * Local UI preferences stored in AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const LOW_FOOD_ALERTS_KEY = 'low_food_alerts_enabled';

let lowFoodAlerts = true;
let initialized = false;

export async function initPreferences(): Promise<void> {
  if (initialized) return;
  try {
    const stored = await AsyncStorage.getItem(LOW_FOOD_ALERTS_KEY);
    if (stored !== null) {
      lowFoodAlerts = stored === 'true';
    }
  } catch {
    // ignore
  }
  initialized = true;
}

export function getLowFoodAlertsEnabled(): boolean {
  return lowFoodAlerts;
}

export async function setLowFoodAlertsEnabled(enabled: boolean): Promise<void> {
  lowFoodAlerts = enabled;
  try {
    await AsyncStorage.setItem(LOW_FOOD_ALERTS_KEY, String(enabled));
  } catch {
    // ignore
  }
}
