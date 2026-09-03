/**
 * Home — pet name + claim code. No onboard funnel.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants';
import { api, errorMessage, isDeviceOffline, isFoodLow } from '../services/api';
import { useSession } from '../lib/useSession';
import type { Device } from '../types';

export function HomeScreen() {
  const { isLoggedIn } = useSession();
  const [petName, setPetName] = useState('');
  const [claimCode, setClaimCode] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [claiming, setClaiming] = useState(false);
  const [savingPet, setSavingPet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isLoggedIn) {
      setDevices([]);
      return;
    }
    try {
      const pet = await api.getPet();
      if (pet?.name) setPetName(pet.name);
    } catch {
      // GET /api/pet may 404 — keep local name
    }
    try {
      setDevices(await api.getDevices());
    } catch (err) {
      setStatusNote(errorMessage(err, 'Could not load devices'));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    setStatusNote(null);
    await load();
    setRefreshing(false);
  };

  const savePetName = async () => {
    const name = petName.trim();
    setPetName(name);
    setSavingPet(true);
    try {
      await api.putPet(name);
    } catch {
      // local fallback if GET/PUT /api/pet 404s
    } finally {
      setSavingPet(false);
    }
  };

  const claim = async () => {
    const code = claimCode.trim();
    if (!code) {
      Alert.alert('Claim code', 'Enter the feeder claim code.');
      return;
    }
    if (!isLoggedIn) {
      Alert.alert('Sign in', 'Log in from Settings before claiming a feeder.');
      return;
    }
    setClaiming(true);
    setStatusNote(null);
    try {
      await api.claimDevice(code);
      setClaimCode('');
      setDevices(await api.getDevices());
    } catch (err) {
      Alert.alert('Claim failed', errorMessage(err, 'Could not claim device'));
    } finally {
      setClaiming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>🐾 Smart Pet</Text>
        <Text style={styles.subtitle}>{petName.trim() || 'Name your pet, then claim a feeder'}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Pet name</Text>
          <TextInput
            style={styles.input}
            value={petName}
            onChangeText={setPetName}
            onEndEditing={savePetName}
            placeholder="e.g. Luna"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="words"
          />
          <TouchableOpacity style={styles.secondaryBtn} onPress={savePetName} disabled={savingPet}>
            <Text style={styles.secondaryBtnText}>{savingPet ? 'Saving…' : 'Save name'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Claim feeder</Text>
          <Text style={styles.hint}>Paste the claim code from the device. MQTT credentials are ignored.</Text>
          <TextInput
            style={styles.input}
            value={claimCode}
            onChangeText={setClaimCode}
            placeholder="Claim code"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.primaryBtn, claiming && styles.btnDisabled]}
            onPress={claim}
            disabled={claiming}
          >
            <Text style={styles.primaryBtnText}>{claiming ? 'Claiming…' : 'Claim'}</Text>
          </TouchableOpacity>
        </View>

        {statusNote ? <Text style={styles.error}>{statusNote}</Text> : null}

        <Text style={styles.sectionTitle}>Feeders</Text>
        {!isLoggedIn ? (
          <Text style={styles.hint}>Log in from Settings to load claimed feeders.</Text>
        ) : devices.length === 0 ? (
          <Text style={styles.hint}>No feeders claimed yet.</Text>
        ) : (
          devices.map((device) => {
            const offline = isDeviceOffline(device);
            const low = isFoodLow(device);
            return (
              <View key={device.id} style={styles.deviceCard}>
                <View style={styles.deviceHeader}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={styles.statusBadge}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: offline ? COLORS.offline : COLORS.online },
                      ]}
                    />
                    <Text style={styles.statusText}>{offline ? 'offline' : 'online'}</Text>
                  </View>
                </View>
                <Text style={[styles.levelText, low && { color: COLORS.danger }]}>
                  Food {device.foodLevel}%{low ? ' · low' : ''}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xl },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 2, marginBottom: SPACING.md },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  hint: { fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.sm },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surfaceSecondary,
    marginBottom: SPACING.sm,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryBtn: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  secondaryBtnText: { color: COLORS.primary, fontWeight: '600' },
  btnDisabled: { opacity: 0.6 },
  error: { color: COLORS.danger, marginBottom: SPACING.sm },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.sm },
  deviceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  deviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deviceName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, color: COLORS.textMuted, textTransform: 'capitalize' },
  levelText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
});
