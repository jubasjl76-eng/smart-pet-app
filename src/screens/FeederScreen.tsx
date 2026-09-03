import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants';
import { ScheduleCard } from '../components';
import { api, errorMessage, isDeviceOffline, isFoodLow } from '../services/api';
import { useSession } from '../lib/useSession';
import type { Device, Schedule } from '../types';

export const FeederScreen: React.FC = () => {
  const { isLoggedIn } = useSession();
  const [devices, setDevices] = useState<Device[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feeding, setFeeding] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hour, setHour] = useState('8');
  const [minute, setMinute] = useState('0');
  const [savingSchedule, setSavingSchedule] = useState(false);

  const selected = devices.find((d) => d.id === selectedId) ?? devices[0];

  const loadDevices = useCallback(async () => {
    if (!isLoggedIn) {
      setDevices([]);
      setSelectedId(null);
      setSchedules([]);
      return;
    }
    const next = await api.getDevices();
    setDevices(next);
    setSelectedId((prev) => (prev && next.some((d) => d.id === prev) ? prev : next[0]?.id ?? null));
  }, [isLoggedIn]);

  useEffect(() => {
    loadDevices().catch((err) => setFeedError(errorMessage(err, 'Could not load feeders')));
  }, [loadDevices]);

  useEffect(() => {
    if (!isLoggedIn || !selectedId) {
      setSchedules([]);
      return;
    }
    api
      .getSchedules(selectedId)
      .then(setSchedules)
      .catch((err) => setFeedError(errorMessage(err, 'Could not load schedules')));
  }, [isLoggedIn, selectedId]);

  const onRefresh = async () => {
    setRefreshing(true);
    setFeedError(null);
    try {
      await loadDevices();
    } catch (err) {
      setFeedError(errorMessage(err, 'Could not load feeders'));
    } finally {
      setRefreshing(false);
    }
  };

  const handleFeed = async () => {
    if (!selected) {
      Alert.alert('No feeder', 'Claim a feeder from Home first.');
      return;
    }
    setFeeding(true);
    setFeedError(null);
    try {
      await api.feedNow(selected.id);
    } catch (err) {
      const msg = errorMessage(err, 'Feed failed');
      setFeedError(msg);
      Alert.alert('Feed failed', msg);
    } finally {
      setFeeding(false);
    }
  };

  const addSchedule = async () => {
    if (!selected) {
      Alert.alert('No feeder', 'Claim a feeder from Home first.');
      return;
    }
    const h = Number(hour);
    const m = Number(minute);
    if (!Number.isInteger(h) || h < 0 || h > 23 || !Number.isInteger(m) || m < 0 || m > 59) {
      Alert.alert('Invalid time', 'Hour must be 0–23 and minute 0–59.');
      return;
    }
    setSavingSchedule(true);
    try {
      await api.createSchedule({ deviceId: selected.id, hour: h, minute: m });
      setSchedules(await api.getSchedules(selected.id));
    } catch (err) {
      Alert.alert('Schedule failed', errorMessage(err, 'Could not create schedule'));
    } finally {
      setSavingSchedule(false);
    }
  };

  const onToggle = async (id: string, enabled: boolean) => {
    try {
      await api.toggleSchedule(id, enabled);
      if (selected) setSchedules(await api.getSchedules(selected.id));
    } catch (err) {
      Alert.alert('Toggle failed', errorMessage(err, 'Could not toggle schedule'));
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.deleteSchedule(id);
      if (selected) setSchedules(await api.getSchedules(selected.id));
    } catch (err) {
      Alert.alert('Delete failed', errorMessage(err, 'Could not delete schedule'));
    }
  };

  const getFoodColor = (level: number) => {
    if (level < 20) return COLORS.danger;
    if (level < 50) return COLORS.warning;
    return COLORS.success;
  };

  const onlineCount = devices.filter((d) => !isDeviceOffline(d)).length;
  const lowCount = devices.filter((d) => isFoodLow(d)).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐶 Feeders</Text>
        <Text style={styles.subtitle}>{devices.length} devices</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={[styles.feedButton, feeding && styles.feedButtonActive]}
          onPress={handleFeed}
          disabled={feeding}
        >
          <Text style={styles.feedButtonIcon}>🍖</Text>
          <Text style={styles.feedButtonText}>{feeding ? 'Feeding...' : 'Feed Now'}</Text>
        </TouchableOpacity>
        {feedError ? <Text style={styles.error}>{feedError}</Text> : null}
        {!isLoggedIn ? <Text style={styles.hint}>Log in from Settings to feed and schedule.</Text> : null}

        <Text style={styles.sectionTitle}>Your Feeders</Text>
        {devices.length === 0 ? (
          <Text style={styles.hint}>No feeders yet. Claim one from Home.</Text>
        ) : (
          devices.map((feeder) => {
            const offline = isDeviceOffline(feeder);
            const active = selected?.id === feeder.id;
            return (
              <TouchableOpacity
                key={feeder.id}
                style={[styles.deviceCard, active && styles.deviceCardActive]}
                onPress={() => setSelectedId(feeder.id)}
              >
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{feeder.name}</Text>
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
                </View>
                <View style={styles.levelContainer}>
                  <View style={styles.levelBar}>
                    <View
                      style={[
                        styles.levelFill,
                        {
                          width: `${Math.max(0, Math.min(100, feeder.foodLevel))}%`,
                          backgroundColor: getFoodColor(feeder.foodLevel),
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.levelText, { color: getFoodColor(feeder.foodLevel) }]}>
                    {feeder.foodLevel}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{devices.length}</Text>
            <Text style={styles.statLabel}>Devices</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>{onlineCount}</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.warning }]}>{lowCount}</Text>
            <Text style={styles.statLabel}>Low Food</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Schedules</Text>
        <View style={styles.scheduleForm}>
          <TextInput
            style={styles.timeInput}
            value={hour}
            onChangeText={setHour}
            keyboardType="number-pad"
            placeholder="HH"
            placeholderTextColor={COLORS.textMuted}
            maxLength={2}
          />
          <Text style={styles.timeSep}>:</Text>
          <TextInput
            style={styles.timeInput}
            value={minute}
            onChangeText={setMinute}
            keyboardType="number-pad"
            placeholder="MM"
            placeholderTextColor={COLORS.textMuted}
            maxLength={2}
          />
          <TouchableOpacity
            style={[styles.addBtn, savingSchedule && styles.feedButtonActive]}
            onPress={addSchedule}
            disabled={savingSchedule}
          >
            <Text style={styles.addBtnText}>{savingSchedule ? 'Adding…' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
        {schedules.map((s) => (
          <ScheduleCard
            key={s.id}
            id={s.id}
            hour={s.hour}
            minute={s.minute}
            enabled={s.enabled}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
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
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  feedButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginVertical: SPACING.md,
    ...SHADOWS.medium,
  },
  feedButtonActive: {
    backgroundColor: COLORS.primaryDark,
  },
  feedButtonIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  feedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  deviceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  deviceCardActive: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: 'capitalize',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  levelFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    width: 45,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scheduleForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  timeInput: {
    width: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  timeSep: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
