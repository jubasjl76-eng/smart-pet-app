import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants';
import { api, errorMessage } from '../services/api';
import { useSession } from '../lib/useSession';
import { initPreferences, getLowFoodAlertsEnabled, setLowFoodAlertsEnabled } from '../lib/preferences';
import type { User } from '../types';

export const SettingsScreen: React.FC = () => {
  const { isLoggedIn } = useSession();
  const [lowFoodAlerts, setLowFoodAlerts] = React.useState(true);

  React.useEffect(() => {
    initPreferences().then(() => {
      setLowFoodAlerts(getLowFoodAlertsEnabled());
    });
  }, []);

  const onToggleLowFoodAlerts = (value: boolean) => {
    setLowFoodAlerts(value);
    setLowFoodAlertsEnabled(value);
  };
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user, setUser] = React.useState<User | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      return;
    }
    api
      .me()
      .then(setUser)
      .catch(() => setUser({ email }));
  }, [isLoggedIn, email]);

  const login = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Sign in', 'Email and password are required.');
      return;
    }
    setBusy(true);
    try {
      const next = await api.login(email.trim(), password);
      setUser(next);
      setPassword('');
    } catch (err) {
      Alert.alert('Login failed', errorMessage(err, 'Could not sign in'));
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setPassword('');
  };

  const displayName = user?.name || user?.email || email || 'Owner';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {isLoggedIn ? (
            <>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{displayName}</Text>
                  <Text style={styles.profileEmail}>{user?.email || 'Signed in'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Log out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.settingLabel}>Owner login</Text>
              <Text style={styles.settingDesc}>JWT is kept in memory for this session only.</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.loginButton, busy && styles.btnDisabled]}
                onPress={login}
                disabled={busy}
              >
                <Text style={styles.loginButtonText}>{busy ? 'Signing in…' : 'Log in'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Low Food Alerts</Text>
              <Text style={styles.settingDesc}>Show in-app low-food indicators when food is below 20%.</Text>
            </View>
            <Switch
              value={lowFoodAlerts}
              onValueChange={onToggleLowFoodAlerts}
              trackColor={{ false: COLORS.surfaceSecondary, true: COLORS.primaryLight }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={styles.version}>Smart Pet v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surfaceSecondary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  settingInfo: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
});
