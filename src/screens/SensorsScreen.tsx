/**
 * Sensors Screen - Temperature, Humidity, Door Status
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'door' | 'airquality';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  location: string;
  lastUpdate: string;
}

export function SensorsScreen() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSensors();
    const interval = setInterval(loadSensors, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSensors = async () => {
    // Mock data - would connect to sensors service API
    setSensors([
      { id: 'temp-01', name: 'Kennel Temperature', type: 'temperature', value: 22.5, unit: '°C', status: 'normal', location: 'Main Kennel', lastUpdate: new Date().toISOString() },
      { id: 'temp-02', name: 'Outdoor Temperature', type: 'temperature', value: 28.0, unit: '°C', status: 'warning', location: 'Outside', lastUpdate: new Date().toISOString() },
      { id: 'humid-01', name: 'Kennel Humidity', type: 'humidity', value: 45, unit: '%', status: 'normal', location: 'Main Kennel', lastUpdate: new Date().toISOString() },
      { id: 'door-01', name: 'Main Door', type: 'door', value: 0, unit: '', status: 'normal', location: 'Kennel Entrance', lastUpdate: new Date().toISOString() },
      { id: 'air-01', name: 'Air Quality', type: 'airquality', value: 420, unit: 'ppm', status: 'normal', location: 'Main Kennel', lastUpdate: new Date().toISOString() },
    ]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSensors();
    setRefreshing(false);
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return '🌡️';
      case 'humidity': return '💧';
      case 'door': return '🚪';
      case 'airquality': return '🌬️';
      default: return '📡';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading sensors...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>📡 Sensors</Text>

        {/* Main Sensors Display */}
        <View style={styles.mainSensors}>
          <SensorCard
            icon="🌡️"
            name="Temperature"
            value={sensors.find(s => s.type === 'temperature')?.value || 0}
            unit="°C"
            status={sensors.find(s => s.type === 'temperature')?.status || 'normal'}
          />
          <SensorCard
            icon="💧"
            name="Humidity"
            value={sensors.find(s => s.type === 'humidity')?.value || 0}
            unit="%"
            status={sensors.find(s => s.type === 'humidity')?.status || 'normal'}
          />
        </View>

        {/* Door Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚪 Door Status</Text>
          {sensors.filter(s => s.type === 'door').map(door => (
            <View key={door.id} style={styles.doorCard}>
              <View style={styles.doorInfo}>
                <Text style={styles.doorName}>{door.name}</Text>
                <Text style={styles.doorLocation}>{door.location}</Text>
              </View>
              <View style={[styles.doorStatus, door.value === 1 ? styles.doorOpen : styles.doorClosed]}>
                <Text style={styles.doorStatusText}>{door.value === 1 ? '🚪 Open' : '🔒 Closed'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* All Sensors List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 All Sensors</Text>
          {sensors.map(sensor => (
            <View key={sensor.id} style={styles.sensorRow}>
              <View style={styles.sensorLeft}>
                <Text style={styles.sensorIcon}>{getSensorIcon(sensor.type)}</Text>
                <View>
                  <Text style={styles.sensorName}>{sensor.name}</Text>
                  <Text style={styles.sensorLocation}>{sensor.location}</Text>
                </View>
              </View>
              <View style={styles.sensorRight}>
                <Text style={[styles.sensorValue, { color: getStatusColor(sensor.status) }]}>
                  {sensor.type === 'door' ? (sensor.value === 1 ? 'Open' : 'Closed') : `${sensor.value}${sensor.unit}`}
                </Text>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(sensor.status) }]} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SensorCard({ icon, name, value, unit, status }: { icon: string; name: string; value: number; unit: string; status: string }) {
  const statusColor = status === 'normal' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444';
  
  return (
    <View style={styles.sensorCard}>
      <Text style={styles.sensorCardIcon}>{icon}</Text>
      <Text style={styles.sensorCardName}>{name}</Text>
      <Text style={[styles.sensorCardValue, { color: statusColor }]}>{value}{unit}</Text>
      <View style={[styles.sensorCardStatus, { backgroundColor: statusColor + '20' }]}>
        <Text style={[styles.sensorCardStatusText, { color: statusColor }]}>{status.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  loading: { textAlign: 'center', marginTop: 50 },
  mainSensors: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  sensorCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2 },
  sensorCardIcon: { fontSize: 32, marginBottom: 8 },
  sensorCardName: { fontSize: 14, color: '#666', marginBottom: 4 },
  sensorCardValue: { fontSize: 28, fontWeight: 'bold' },
  sensorCardStatus: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  sensorCardStatusText: { fontSize: 10, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  doorCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  doorInfo: { flex: 1 },
  doorName: { fontSize: 16, fontWeight: '600' },
  doorLocation: { fontSize: 12, color: '#666', marginTop: 2 },
  doorStatus: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  doorOpen: { backgroundColor: '#fee2e2' },
  doorClosed: { backgroundColor: '#d1fae5' },
  doorStatusText: { fontSize: 14, fontWeight: '600' },
  sensorRow: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, elevation: 1 },
  sensorLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sensorIcon: { fontSize: 24 },
  sensorName: { fontSize: 14, fontWeight: '600' },
  sensorLocation: { fontSize: 12, color: '#666' },
  sensorRight: { alignItems: 'flex-end' },
  sensorValue: { fontSize: 16, fontWeight: 'bold' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});
