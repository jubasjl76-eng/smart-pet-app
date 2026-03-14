import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '../constants';
import { api } from '../services/api';

interface Dog {
  _id: string;
  name: string;
  breed: string;
  deviceId: {
    _id: string;
    name: string;
    battery: number;
    status: string;
  };
}

interface Location {
  _id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  battery: number;
  timestamp: string;
}

interface SafeZone {
  _id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radius: number;
  active: boolean;
}

export const TrackerScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [latestLocation, setLatestLocation] = useState<Location | null>(null);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDogs();
    const interval = setInterval(fetchLatestLocation, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [selectedDog]);

  const fetchDogs = async () => {
    try {
      const response = await api.get('/collar/dogs');
      setDogs(response.data.dogs);
      if (response.data.dogs.length > 0 && !selectedDog) {
        setSelectedDog(response.data.dogs[0]);
      }
    } catch (error) {
      console.error('Failed to fetch dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestLocation = async () => {
    if (!selectedDog) return;
    
    try {
      const response = await api.get(`/collar/locations/latest/${selectedDog._id}`);
      if (response.data.location) {
        setLatestLocation(response.data.location);
        fetchLocationHistory();
        fetchSafeZones();
      }
    } catch (error) {
      console.error('Failed to fetch location:', error);
    }
  };

  const fetchLocationHistory = async () => {
    if (!selectedDog) return;
    
    try {
      const response = await api.get(`/collar/locations?dogId=${selectedDog._id}&limit=50`);
      setLocations(response.data.locations || []);
    } catch (error) {
      console.error('Failed to fetch location history:', error);
    }
  };

  const fetchSafeZones = async () => {
    if (!selectedDog) return;
    
    try {
      const response = await api.get(`/collar/safezones?dogId=${selectedDog._id}`);
      setSafeZones(response.data.safeZones || []);
    } catch (error) {
      console.error('Failed to fetch safe zones:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDogs();
    await fetchLatestLocation();
    setRefreshing(false);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return COLORS.success;
      case 'low_battery': return COLORS.warning;
      case 'offline': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getBatteryIcon = (level?: number) => {
    if (!level) return '🔋';
    if (level > 75) return '🔋';
    if (level > 50) return '🪫';
    if (level > 20) return '🪫';
    return '🪫';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getTimeSince = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (dogs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🐕</Text>
          <Text style={styles.emptyTitle}>No Dogs Found</Text>
          <Text style={styles.emptyText}>
            Register a GPS collar and add your dog to start tracking
          </Text>
        </View>
      </View>
    );
  }

  const region = latestLocation ? {
    latitude: latestLocation.latitude,
    longitude: latestLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : undefined;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐕 Tracker</Text>
        <View style={styles.dogSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dogs.map((dog) => (
              <TouchableOpacity
                key={dog._id}
                style={[
                  styles.dogChip,
                  selectedDog?._id === dog._id && styles.dogChipActive
                ]}
                onPress={() => setSelectedDog(dog)}
              >
                <Text style={[
                  styles.dogChipText,
                  selectedDog?._id === dog._id && styles.dogChipTextActive
                ]}>
                  {dog.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {region && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton
          >
            {/* Current location marker */}
            {latestLocation && (
              <Marker
                coordinate={{
                  latitude: latestLocation.latitude,
                  longitude: latestLocation.longitude,
                }}
                title={selectedDog?.name}
                description={`Last seen: ${getTimeSince(latestLocation.timestamp)}`}
              >
                <View style={styles.markerContainer}>
                  <Text style={styles.markerIcon}>🐕</Text>
                </View>
              </Marker>
            )}

            {/* Path polyline */}
            {locations.length > 1 && (
              <Polyline
                coordinates={locations
                  .slice(0, 50)
                  .reverse()
                  .map((loc) => ({
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                  }))}
                strokeColor={COLORS.primary}
                strokeWidth={3}
              />
            )}

            {/* Safe zones */}
            {safeZones.map((zone) => (
              <Marker
                key={zone._id}
                coordinate={{
                  latitude: zone.centerLat,
                  longitude: zone.centerLng,
                }}
              >
                <View style={[styles.zoneMarker, !zone.active && styles.zoneMarkerInactive]}>
                  <Text style={styles.zoneMarkerText}>📍</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        )}

        {/* Dog info overlay */}
        {selectedDog && latestLocation && (
          <View style={styles.infoOverlay}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.dogName}>{selectedDog.name}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(selectedDog.deviceId?.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {selectedDog.deviceId?.status || 'unknown'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  {getBatteryIcon(selectedDog.deviceId?.battery)} {selectedDog.deviceId?.battery}%
                </Text>
                <Text style={styles.infoText}>
                  📍 {getTimeSince(latestLocation.timestamp)}
                </Text>
                {latestLocation.speed > 0 && (
                  <Text style={styles.infoText}>
                    🚶 {Math.round(latestLocation.speed * 3.6)} km/h
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Safe zones list */}
      <View style={styles.safezonesSection}>
        <Text style={styles.sectionTitle}>Safe Zones</Text>
        {safeZones.length === 0 ? (
          <Text style={styles.emptyText}>No safe zones configured</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {safeZones.map((zone) => (
              <View key={zone._id} style={styles.zoneCard}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneRadius}>{zone.radius}m radius</Text>
                <View style={[styles.zoneStatus, zone.active ? styles.zoneActive : styles.zoneInactive]}>
                  <Text style={styles.zoneStatusText}>{zone.active ? 'Active' : 'Inactive'}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  dogSelector: {
    flexDirection: 'row',
  },
  dogChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: 8,
  },
  dogChipActive: {
    backgroundColor: COLORS.primary,
  },
  dogChipText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  dogChipTextActive: {
    color: COLORS.white,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  markerIcon: {
    fontSize: 20,
  },
  zoneMarker: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: 4,
  },
  zoneMarkerInactive: {
    backgroundColor: COLORS.textSecondary,
  },
  zoneMarkerText: {
    fontSize: 12,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dogName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  safezonesSection: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  zoneCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  zoneRadius: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  zoneStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  zoneActive: {
    backgroundColor: COLORS.success + '20',
  },
  zoneInactive: {
    backgroundColor: COLORS.textSecondary + '20',
  },
  zoneStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
