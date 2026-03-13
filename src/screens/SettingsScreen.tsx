import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Button } from '../components';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { checkHealth } from '../services/api';

export const SettingsScreen: React.FC = () => {
  const handleTestConnection = async () => {
    const isHealthy = await checkHealth();
    if (isHealthy) {
      Alert.alert('Success', 'Connected to API successfully! ✅');
    } else {
      Alert.alert('Error', 'Could not connect to API. Make sure the server is running.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection</Text>
        <Button
          title="Test API Connection"
          onPress={handleTestConnection}
          variant="outline"
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Feeder API</Text>
          <Text style={styles.configValue}>http://localhost:3002/api</Text>
        </View>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Water API</Text>
          <Text style={styles.configValue}>http://localhost:3003/api</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Smart Pet App v1.0.0
        </Text>
        <Text style={styles.aboutSubtext}>
          Control your smart pet feeder and water dispenser from anywhere.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help</Text>
        <Text style={styles.helpText}>
          • Make sure your devices are powered on{'\n'}
          • Ensure your phone is on the same network{'\n'}
          • Start the backend servers before using the app{'\n'}
          • Check GitHub for full documentation
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  button: {
    marginTop: SPACING.xs,
  },
  configItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  configLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginBottom: 4,
  },
  configValue: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontFamily: 'monospace',
  },
  aboutText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  aboutSubtext: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  helpText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
  },
});
