import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  status?: 'good' | 'warning' | 'danger' | 'neutral';
  onPress?: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  unit,
  icon,
  status = 'neutral',
  onPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return COLORS.success;
      case 'warning':
        return COLORS.warning;
      case 'danger':
        return COLORS.danger;
      default:
        return COLORS.textSecondary;
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: getStatusColor() }]}>
          {value}
        </Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
  },
  unit: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.xs,
  },
});
