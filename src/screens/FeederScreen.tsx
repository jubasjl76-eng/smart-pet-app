import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { StatusCard, Button, ScheduleCard } from '../components';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { feederApi } from '../services/api';
import { Feeder, Schedule } from '../types';

export const FeederScreen: React.FC = () => {
  const [feeder, setFeeder] = useState<Feeder | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feeding, setFeeding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [feedersData, schedulesData] = await Promise.all([
        feederApi.get<{ feeders: Feeder[] }>('/feeders'),
        feederApi.get<{ schedules: Schedule[] }>('/schedule'),
      ]);
      
      if (feedersData.feeders.length > 0) {
        setFeeder(feedersData.feeders[0]);
      }
      setSchedules(schedulesData.schedules || []);
    } catch (error) {
      console.error('Failed to fetch feeder data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleFeed = async () => {
    if (!feeder) return;
    
    setFeeding(true);
    try {
      await feederApi.post('/feed', { feeder_id: feeder.id, type: 'manual' });
      Alert.alert('Success', 'Food dispensed! 🍖');
    } catch (error) {
      Alert.alert('Error', 'Failed to dispense food');
    } finally {
      setFeeding(false);
    }
  };

  const handleToggleSchedule = async (id: string, enabled: boolean) => {
    try {
      await feederApi.put(`/schedule/${id}`, { enabled });
      setSchedules(prev => 
        prev.map(s => s.id === id ? { ...s, enabled } : s)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await feederApi.delete(`/schedule/${id}`);
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete schedule');
    }
  };

  const getFoodStatus = () => {
    if (!feeder) return 'neutral';
    if (feeder.foodLevel < 20) return 'danger';
    if (feeder.foodLevel < 50) return 'warning';
    return 'good';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      <Text style={styles.title}>🐶 Smart Feeder</Text>
      
      {feeder ? (
        <>
          <View style={styles.statusGrid}>
            <StatusCard
              title="Food Level"
              value={feeder.foodLevel}
              unit="%"
              icon="🍖"
              status={getFoodStatus()}
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatusCard
              title="WiFi"
              value={feeder.wifiRssi}
              unit="dBm"
              icon="📶"
              status="neutral"
            />
            <StatusCard
              title="Uptime"
              value={Math.floor(feeder.uptimeMs / 3600000)}
              unit="hrs"
              icon="⏱️"
              status="neutral"
            />
          </View>

          <Button
            title={feeding ? 'Dispensing...' : '🍖 Feed Now'}
            onPress={handleFeed}
            loading={feeding}
            variant="primary"
            size="large"
            style={styles.feedButton}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No feeder connected</Text>
          <Text style={styles.emptySubtext}>Power on your feeder to see status</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏰ Feeding Schedule</Text>
        {schedules.length > 0 ? (
          schedules.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              id={schedule.id}
              hour={schedule.hour}
              minute={schedule.minute}
              enabled={schedule.enabled}
              onToggle={handleToggleSchedule}
              onDelete={handleDeleteSchedule}
            />
          ))
        ) : (
          <Text style={styles.emptySubtext}>No schedules set</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  loadingText: {
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  statusGrid: {
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  feedButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
