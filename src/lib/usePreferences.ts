import { useEffect, useState } from 'react';
import { initPreferences, getLowFoodAlertsEnabled } from './preferences';

export function useLowFoodAlerts(): boolean {
  const [enabled, setEnabled] = useState(getLowFoodAlertsEnabled());

  useEffect(() => {
    initPreferences().then(() => {
      setEnabled(getLowFoodAlertsEnabled());
    });
    const interval = setInterval(() => {
      setEnabled(getLowFoodAlertsEnabled());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return enabled;
}
