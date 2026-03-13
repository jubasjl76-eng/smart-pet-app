import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

interface ScheduleCardProps {
  id: string;
  hour: number;
  minute: number;
  enabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  id,
  hour,
  minute,
  enabled,
  onToggle,
  onDelete,
}) => {
  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <View style={[styles.container, !enabled && styles.disabled]}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(hour, minute)}</Text>
        <Text style={styles.label}>{enabled ? 'Active' : 'Inactive'}</Text>
      </View>
      <View style={styles.actions}>
        <Switch
          value={enabled}
          onValueChange={(value) => onToggle(id, value)}
          trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
          thumbColor={enabled ? COLORS.text : COLORS.textSecondary}
        />
        <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabled: {
    opacity: 0.6,
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  deleteText: {
    fontSize: 20,
  },
});
