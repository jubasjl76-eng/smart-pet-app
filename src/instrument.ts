/**
 * Sentry (@sentry/react-native) — imported first from index.ts (Phase 15).
 *
 * No EXPO_PUBLIC_SENTRY_DSN → Sentry.init is a no-op, so this ships ahead of
 * the Sentry project existing. Native crash capture needs a dev/EAS build
 * (the plugin in app.json); JS errors report from Expo Go too.
 */
import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim() || undefined;

Sentry.init({
  dsn,
  environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT || (__DEV__ ? 'development' : 'production'),
  release: process.env.EXPO_PUBLIC_SENTRY_RELEASE,
  // Perf tracing stays off until Phase 16.
  tracesSampleRate: Number(process.env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE) || 0,
  sendDefaultPii: false,
  enabled: !!dsn,
});
