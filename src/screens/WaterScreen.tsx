import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { StatusCard, Button, ScheduleCard } from '../components';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { waterApi } from '../services/api';
import { WaterDevice, Schedule } from '../types';

export const WaterScreen: React.FC = () => {
  const [device, setDevice] = useState<WaterDevice | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dispensing, setDispensing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [devicesData, schedulesData] = await Promise.all([
        waterApi.get<{ devices: WaterDevice[] }>('/devices'),
        waterApi.get<{ schedules: Schedule[] }>('/schedule'),
      ]);
      
      if (devicesData.devices.length > 0) {
        setDevice(devicesData.devices[0]);
      }
      setSchedules(schedulesData.schedules || []);
    } catch (error) {
      console.error('Failed to fetch water data:', error);
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

  const handleDispense = async () => {
    if (!device) return;
    
    setDispensing(true);
    try {
      await waterApi.post('/dispense', { device_id: device.id, type: 'manual' });
      Alert.alert('Success', 'Water dispensed! 💧');
    } catch (error) {
      Alert.alert('Error', 'Failed to dispense water');
    } finally {
      setDispensing(false);
    }
  };

  const handleToggleSchedule = async (id: string, enabled: boolean) => {
    try {
      await waterApi.put(`/schedule/${id}`, { enabled });
      setSchedules(prev => 
        prev.map(s => s.id === id ? { ...s, enabled } : s)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await waterApi.delete(`/schedule/${id}`);
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete schedule');
    }
  };

  const getWaterStatus = () => {
    if (!device) return 'neutral';
    if (device.waterLevel < 20) return 'danger';
    if (device.waterLevel < 50) return 'warning';
    return 'good';
  };

  const getQualityLabel = (quality: number) => {
    switch (quality) {
      case 0:
        return { text: 'Good', color: COLORS.success };
      case 1:
        return { text: 'Acceptable', color: COLORS.warning };
      case 2:
        return { text: 'Poor', color: COLORS.danger };
      default:
        return { text: 'Unknown', color: COLORS.textSecondary };
    }
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
      <Text style={styles.title}>💧 Smart Water</Text>
      
      {device ? (
        <>
          <View style={styles.statusGrid}>
            <StatusCard
              title="Water Level"
              value={device.waterLevel}
              unit="%"
              icon="💧"
              status={getWaterStatus()}
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatusCard
              title="TDS"
              value={device.tds}
              unit="ppm"
              icon="🔬"
              status="neutral"
            />
            <StatusCard
              title="Temp"
              value={device.temperature.toFixed(1)}
              unit="°C"
              icon="🌡️"
              status="neutral"
            />
          </View>

          <View style={styles.qualityCard}>
            <Text style={styles.qualityLabel}>Water Quality</Text>
            <Text style={[styles.qualityValue, { color: getQualityLabel(device.waterQuality).color }]}>
              {getQualityLabel(device.waterQuality).text}
            </Text>
          </View>

          <Button
            title={dispensing ? 'Dispensing...' : '💧 Dispense Water'}
            onPress={handleDispense}
            loading={dispensing}
            variant="secondary"
            size="large"
            style={styles.dispenseButton}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No device connected</Text>
          <Text style={styles.emptySubtext}>Power on your water dispenser to see status</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏰ Dispensing Schedule</Text>
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
  qualityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    textTransform: 'uppercase',
  },
  qualityValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  dispenseButton: {
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
