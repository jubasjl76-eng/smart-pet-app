import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants';

export const WaterScreen: React.FC = () => {
  const [dispensing, setDispensing] = useState(false);

  const handleDispense = () => {
    setDispensing(true);
    setTimeout(() => setDispensing(false), 2000);
  };

  const dispensers = [
    { id: '1', name: 'Living Room', waterLevel: 80, quality: 'Good', temp: 22, status: 'online' },
    { id: '2', name: 'Kitchen', waterLevel: 45, quality: 'Good', temp: 21, status: 'online' },
    { id: '3', name: 'Garden', waterLevel: 30, quality: 'Poor', temp: 18, status: 'low' },
  ];

  const getWaterColor = (level: number) => {
    if (level < 25) return COLORS.danger;
    if (level < 50) return COLORS.warning;
    return COLORS.info;
  };

  const getQualityColor = (quality: string) => {
    if (quality === 'Good') return COLORS.success;
    if (quality === 'Acceptable') return COLORS.warning;
    return COLORS.danger;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💧 Water</Text>
        <Text style={styles.subtitle}>{dispensers.length} devices</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Dispense Button */}
        <TouchableOpacity 
          style={[styles.dispenseButton, dispensing && styles.dispenseButtonActive]} 
          onPress={handleDispense}
          disabled={dispensing}
        >
          <Text style={styles.dispenseButtonIcon}>🚿</Text>
          <Text style={styles.dispenseButtonText}>
            {dispensing ? 'Dispensing...' : 'Dispense Water'}
          </Text>
        </TouchableOpacity>

        {/* Dispensers List */}
        <Text style={styles.sectionTitle}>Your Dispensers</Text>
        
        {dispensers.map((dispenser) => (
          <View key={dispenser.id} style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{dispenser.name}</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: dispenser.status === 'online' ? COLORS.online : COLORS.offline }]} />
                  <Text style={styles.statusText}>{dispenser.status}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text>⋯</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Water</Text>
                <View style={styles.levelContainer}>
                  <View style={styles.levelBar}>
                    <View 
                      style={[
                        styles.levelFill, 
                        { 
                          width: `${dispenser.waterLevel}%`,
                          backgroundColor: getWaterColor(dispenser.waterLevel)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.levelText, { color: getWaterColor(dispenser.waterLevel) }]}>
                    {dispenser.waterLevel}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Quality</Text>
                <Text style={[styles.qualityText, { color: getQualityColor(dispenser.quality) }]}>
                  {dispenser.quality}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Temp</Text>
                <Text style={styles.tempText}>{dispenser.temp}°C</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Devices</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>2</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.info }]}>80%</Text>
            <Text style={styles.statLabel}>Avg Level</Text>
          </View>
        </View>
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
  dispenseButton: {
    backgroundColor: COLORS.info,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginVertical: SPACING.md,
    ...SHADOWS.medium,
  },
  dispenseButtonActive: {
    backgroundColor: '#2563eb',
  },
  dispenseButtonIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  dispenseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
  actionButton: {
    padding: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statItem: {
    flex: 1,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  levelBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: SPACING.xs,
  },
  levelFill: {
    height: '100%',
    borderRadius: 3,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    width: 35,
    textAlign: 'right',
  },
  qualityText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  tempText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
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
});
