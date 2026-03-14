import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants';

export const TrackerScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📍 Tracker</Text>
        <Text style={styles.subtitle}>GPS Collar</Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapPlaceholder}>🗺️</Text>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapSubtext}>Live tracking coming soon</Text>
      </View>

      {/* Dog Info */}
      <View style={styles.dogCard}>
        <View style={styles.dogAvatar}>
          <Text style={styles.dogEmoji}>🐕</Text>
        </View>
        <View style={styles.dogInfo}>
          <Text style={styles.dogName}>Max</Text>
          <Text style={styles.dogStatus}>Active • Walking</Text>
        </View>
        <View style={styles.battery}>
          <Text style={styles.batteryIcon}>🔋</Text>
          <Text style={styles.batteryLevel}>85%</Text>
        </View>
      </View>

      {/* Last Seen */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Update</Text>
          <Text style={styles.infoValue}>Just now</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>40.4167° N, 3.7033° W</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Safe Zone</Text>
          <Text style={styles.infoValue}>Home (500m)</Text>
        </View>
      </View>

      {/* Alerts */}
      <View style={styles.alertBanner}>
        <Text style={styles.alertIcon}>✅</Text>
        <Text style={styles.alertText}>Max is safe inside the zone</Text>
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
  mapContainer: {
    flex: 1,
    margin: SPACING.lg,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  mapSubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  dogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  dogAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dogEmoji: {
    fontSize: 28,
  },
  dogInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  dogName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  dogStatus: {
    fontSize: 13,
    color: COLORS.success,
    marginTop: 2,
  },
  battery: {
    alignItems: 'center',
  },
  batteryIcon: {
    fontSize: 20,
  },
  batteryLevel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  alertIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  alertText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
  },
});
