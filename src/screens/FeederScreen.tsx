import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants';

export const FeederScreen: React.FC = () => {
  const [feeding, setFeeding] = useState(false);

  const handleFeed = () => {
    setFeeding(true);
    setTimeout(() => setFeeding(false), 2000);
  };

  const feeders = [
    { id: '1', name: 'Living Room', foodLevel: 75, status: 'online' },
    { id: '2', name: 'Kitchen', foodLevel: 45, status: 'online' },
    { id: '3', name: 'Bedroom', foodLevel: 20, status: 'low' },
  ];

  const getFoodColor = (level: number) => {
    if (level < 25) return COLORS.danger;
    if (level < 50) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐶 Feeders</Text>
        <Text style={styles.subtitle}>{feeders.length} devices</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Feed Button */}
        <TouchableOpacity 
          style={[styles.feedButton, feeding && styles.feedButtonActive]} 
          onPress={handleFeed}
          disabled={feeding}
        >
          <Text style={styles.feedButtonIcon}>🍖</Text>
          <Text style={styles.feedButtonText}>
            {feeding ? 'Feeding...' : 'Feed Now'}
          </Text>
        </TouchableOpacity>

        {/* Feeders List */}
        <Text style={styles.sectionTitle}>Your Feeders</Text>
        
        {feeders.map((feeder) => (
          <View key={feeder.id} style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{feeder.name}</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: feeder.status === 'online' ? COLORS.online : COLORS.offline }]} />
                  <Text style={styles.statusText}>{feeder.status}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text>⋯</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.levelContainer}>
              <View style={styles.levelBar}>
                <View 
                  style={[
                    styles.levelFill, 
                    { 
                      width: `${feeder.foodLevel}%`,
                      backgroundColor: getFoodColor(feeder.foodLevel)
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.levelText, { color: getFoodColor(feeder.foodLevel) }]}>
                {feeder.foodLevel}%
              </Text>
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
            <Text style={[styles.statValue, { color: COLORS.warning }]}>1</Text>
            <Text style={styles.statLabel}>Low Food</Text>
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
    marginBottom: SPACING.xl,
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
});
