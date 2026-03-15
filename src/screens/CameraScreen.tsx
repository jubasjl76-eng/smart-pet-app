/**
 * Camera Screen - Live Camera Streams & Snapshots
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  snapshotUrl?: string;
}

export function CameraScreen() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    // Mock data - would connect to camera service API
    setCameras([
      { id: 'cam-01', name: 'Front Door', location: 'Kennel Entrance', status: 'online' },
      { id: 'cam-02', name: 'Main Area', location: 'Inside Kennel', status: 'online' },
      { id: 'cam-03', name: 'Feeding Area', location: 'Near Feeder', status: 'offline' },
      { id: 'cam-04', name: 'Back Yard', location: 'Outside', status: 'online' },
    ]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCameras();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading cameras...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>📹 Cameras</Text>
        
        {/* Camera Grid */}
        <View style={styles.grid}>
          {cameras.map(camera => (
            <TouchableOpacity
              key={camera.id}
              style={[styles.cameraCard, camera.status === 'offline' && styles.offline]}
              onPress={() => setSelectedCamera(camera)}
            >
              <View style={styles.cameraPreview}>
                {camera.status === 'online' ? (
                  <Text style={styles.cameraIcon}>📹</Text>
                ) : (
                  <Text style={styles.cameraIcon}>📷</Text>
                )}
              </View>
              <View style={styles.cameraInfo}>
                <Text style={styles.cameraName}>{camera.name}</Text>
                <Text style={styles.cameraLocation}>{camera.location}</Text>
                <View style={[styles.statusBadge, camera.status === 'online' ? styles.online : styles.offlineBadge]}>
                  <Text style={styles.statusText}>{camera.status === 'online' ? 'LIVE' : 'OFFLINE'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>▶️</Text>
              <Text style={styles.actionText}>View All Streams</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📸</Text>
              <Text style={styles.actionText}>Snapshots</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  loading: { textAlign: 'center', marginTop: 50 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cameraCard: { width: '47%', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2 },
  offline: { opacity: 0.6 },
  cameraPreview: { height: 120, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { fontSize: 40 },
  cameraInfo: { padding: 12 },
  cameraName: { fontSize: 14, fontWeight: '600' },
  cameraLocation: { fontSize: 12, color: '#666', marginTop: 2 },
  statusBadge: { marginTop: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  online: { backgroundColor: '#d1fae5' },
  offlineBadge: { backgroundColor: '#fee2e2' },
  statusText: { fontSize: 10, fontWeight: '600' },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionText: { fontSize: 12, color: '#666' },
});
