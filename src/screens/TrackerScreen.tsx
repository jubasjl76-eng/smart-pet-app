import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants';

export const TrackerScreen: React.FC = () => {
  const [tracking, setTracking] = useState(true);
  const [battery, setBattery] = useState(85);

  const dogs = [
    { id: '1', name: 'Max', status: 'Active', emoji: '🐕', battery: 85, lat: 40.4167, lng: -3.7033 },
    { id: '2', name: 'Buddy', status: 'Sleeping', emoji: '🐕‍🦺', battery: 62, lat: 40.4168, lng: -3.7034 },
  ];

  const handleToggleTracking = () => {
    setTracking(!tracking);
    Alert.alert(
      tracking ? 'Tracking Paused' : 'Tracking Active',
      tracking ? 'Live tracking is now paused' : 'Live tracking is now enabled'
    );
  };

  const activeDog = dogs[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📍 GPS Tracker</Text>
        <TouchableOpacity 
          style={[styles.liveBadge, tracking && styles.liveBadgeActive]}
          onPress={handleToggleTracking}
        >
          <View style={[styles.liveDot, tracking && styles.liveDotActive]} />
          <Text style={[styles.liveText, tracking && styles.liveTextActive]}>
            {tracking ? 'LIVE' : 'PAUSED'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={styles.mapText}>Live Map View</Text>
          
          {/* Simulated dog position */}
          <View style={styles.dogMarker}>
            <Text style={styles.dogMarkerEmoji}>{activeDog.emoji}</Text>
          </View>
          
          {/* Coordinates display */}
          <View style={styles.coordsDisplay}>
            <Text style={styles.coordsText}>
              {activeDog.lat.toFixed(4)}°N, {Math.abs(activeDog.lng).toFixed(4)}°W
            </Text>
          </View>
        </View>
      </View>

      {/* Dogs List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dogsScroll}>
        {dogs.map((dog) => (
          <TouchableOpacity key={dog.id} style={[styles.dogChip, dog.id === activeDog.id && styles.dogChipActive]}>
            <Text style={styles.dogChipEmoji}>{dog.emoji}</Text>
            <Text style={[styles.dogChipName, dog.id === activeDog.id && styles.dogChipNameActive]}>
              {dog.name}
            </Text>
            <View style={[styles.batteryChip, { backgroundColor: dog.battery > 50 ? COLORS.success : dog.battery > 20 ? COLORS.warning : COLORS.danger }]}>
              <Text style={styles.batteryChipText}>{dog.battery}%</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Active Dog Card */}
      <View style={styles.dogCard}>
        <View style={styles.dogCardHeader}>
          <View style={styles.dogCardLeft}>
            <View style={styles.dogAvatar}>
              <Text style={styles.dogAvatarEmoji}>{activeDog.emoji}</Text>
            </View>
            <View>
              <Text style={styles.dogCardName}>{activeDog.name}</Text>
              <Text style={styles.dogCardStatus}>{activeDog.status} • Walking</Text>
            </View>
          </View>
          <View style={styles.dogCardRight}>
            <Text style={styles.batteryEmoji}>🔋</Text>
            <Text style={styles.batteryText}>{activeDog.battery}%</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Speed</Text>
            <Text style={styles.statValue}>3.2 km/h</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>1.2 km</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>45 min</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📢</Text>
          <Text style={styles.actionText}>Sound</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📍</Text>
          <Text style={styles.actionText}>Locate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔒</Text>
          <Text style={styles.actionText}>Lock</Text>
        </TouchableOpacity>
      </View>

      {/* Safe Zone Status */}
      <View style={styles.safeZoneCard}>
        <View style={styles.safeZoneIcon}>
          <Text>✅</Text>
        </View>
        <View style={styles.safeZoneInfo}>
          <Text style={styles.safeZoneTitle}>Safe Zone: Home</Text>
          <Text style={styles.safeZoneSubtitle}>500m radius • Max is inside</Text>
        </View>
        <TouchableOpacity style={styles.safeZoneButton}>
          <Text style={styles.safeZoneButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  liveBadgeActive: {
    backgroundColor: '#dcfce7',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
    marginRight: 6,
  },
  liveDotActive: {
    backgroundColor: COLORS.success,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  liveTextActive: {
    color: COLORS.success,
  },
  mapContainer: {
    flex: 1,
    margin: SPACING.lg,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  mapText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  dogMarker: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  dogMarkerEmoji: {
    fontSize: 24,
  },
  coordsDisplay: {
    position: 'absolute',
    bottom: SPACING.md,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  coordsText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
  },
  dogsScroll: {
    paddingHorizontal: SPACING.lg,
    maxHeight: 70,
  },
  dogChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    ...SHADOWS.small,
  },
  dogChipActive: {
    backgroundColor: COLORS.primary,
  },
  dogChipEmoji: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  dogChipName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  dogChipNameActive: {
    color: '#fff',
  },
  batteryChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  batteryChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  dogCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  dogCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dogCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dogAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dogAvatarEmoji: {
    fontSize: 28,
  },
  dogCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  dogCardStatus: {
    fontSize: 13,
    color: COLORS.success,
    marginLeft: SPACING.sm,
    marginTop: 2,
  },
  dogCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryEmoji: {
    fontSize: 18,
  },
  batteryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
  },
  safeZoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  safeZoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeZoneInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  safeZoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  safeZoneSubtitle: {
    fontSize: 12,
    color: '#15803d',
    marginTop: 2,
  },
  safeZoneButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: '#fff',
    borderRadius: RADIUS.sm,
  },
  safeZoneButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
