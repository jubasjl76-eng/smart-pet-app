/**
 * Home Screen - Overview Dashboard for Pet Owners
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DeviceStatus {
  feeders: { count: number; lastFeeding: string };
  water: { level: number; lastDispense: string };
  cameras: { online: number; total: number };
  sensors: { temperature: number; humidity: number; doorOpen: boolean };
}

export function HomeScreen() {
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    // Mock data - would connect to backend API
    setStatus({
      feeders: { count: 2, lastFeeding: '2 hours ago' },
      water: { level: 75, lastDispense: '30 min ago' },
      cameras: { online: 3, total: 4 },
      sensors: { temperature: 22.5, humidity: 45, doorOpen: false },
    });
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatus();
    setRefreshing(false);
  };

  if (loading || !status) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>🐾 Smart Pet</Text>
        <Text style={styles.subtitle}>Your pet's home is safe</Text>

        {/* Quick Status */}
        <View style={styles.quickStatus}>
          <QuickStatusCard
            icon="🌡️"
            value={`${status.sensors.temperature}°C`}
            label="Temperature"
            status="normal"
          />
          <QuickStatusCard
            icon="💧"
            value={`${status.sensors.humidity}%`}
            label="Humidity"
            status="normal"
          />
          <QuickStatusCard
            icon="🚪"
            value={status.sensors.doorOpen ? 'Open' : 'Closed'}
            label="Door"
            status={status.sensors.doorOpen ? 'warning' : 'normal'}
          />
        </View>

        {/* Device Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Devices</Text>
          
          <TouchableOpacity style={styles.deviceCard}>
            <View style={styles.deviceIcon}>
              <Text style={styles.iconText}>🍖</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>Feeders</Text>
              <Text style={styles.deviceStatus}>{status.feeders.count} active • Fed {status.feeders.lastFeeding}</Text>
            </View>
            <Text style={styles.deviceArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deviceCard}>
            <View style={styles.deviceIcon}>
              <Text style={styles.iconText}>💧</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>Water Dispenser</Text>
              <Text style={styles.deviceStatus}>{status.water.level}% full • {status.water.lastDispense}</Text>
            </View>
            <View style={[styles.levelBar, { width: `${status.water.level}%` }]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.deviceCard}>
            <View style={styles.deviceIcon}>
              <Text style={styles.iconText}>📹</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>Cameras</Text>
              <Text style={styles.deviceStatus}>{status.cameras.online}/{status.cameras.total} online</Text>
            </View>
            <Text style={styles.deviceArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deviceCard}>
            <View style={styles.deviceIcon}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>GPS Tracker</Text>
              <Text style={styles.deviceStatus}>Last update: 5 min ago</Text>
            </View>
            <Text style={styles.deviceArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🍖</Text>
              <Text style={styles.actionText}>Feed Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💧</Text>
              <Text style={styles.actionText}>Dispense Water</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📹</Text>
              <Text style={styles.actionText}>View Cams</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickStatusCard({ icon, value, label, status }: { icon: string; value: string; label: string; status: string }) {
  const statusColor = status === 'normal' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444';
  
  return (
    <View style={styles.quickCard}>
      <Text style={styles.quickIcon}>{icon}</Text>
      <Text style={[styles.quickValue, { color: statusColor }]}>{value}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  loading: { textAlign: 'center', marginTop: 50 },
  quickStatus: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2 },
  quickIcon: { fontSize: 28, marginBottom: 8 },
  quickValue: { fontSize: 18, fontWeight: 'bold' },
  quickLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  deviceCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8, elevation: 2 },
  deviceIcon: { width: 48, height: 48, backgroundColor: '#f0f0f0', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 24 },
  deviceInfo: { flex: 1, marginLeft: 12 },
  deviceName: { fontSize: 16, fontWeight: '600' },
  deviceStatus: { fontSize: 12, color: '#666', marginTop: 2 },
  deviceArrow: { fontSize: 24, color: '#ccc' },
  levelBar: { position: 'absolute', left: 0, bottom: 0, height: 4, backgroundColor: '#3b82f6', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  actionIcon: { fontSize: 28, marginBottom: 4 },
  actionText: { fontSize: 12, color: '#666' },
});
