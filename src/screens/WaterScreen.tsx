import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants';

export const WaterScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💧 Water</Text>
        <Text style={styles.subtitle}>Unpaired</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.body}>No water dispenser paired.</Text>
        <Text style={styles.hint}>The water loop is not part of this owner-app build.</Text>
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
  card: {
    margin: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  body: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
});
