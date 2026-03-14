import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants';

export const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [lowFoodAlerts, setLowFoodAlerts] = React.useState(true);
  const [lowWaterAlerts, setLowWaterAlerts] = React.useState(true);
  const [geofenceAlerts, setGeofenceAlerts] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Marco</Text>
              <Text style={styles.profileEmail}>marco@test.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Receive alerts on your device</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.surfaceSecondary, true: COLORS.primaryLight }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Low Food Alerts</Text>
              <Text style={styles.settingDesc}>Alert when food is below 20%</Text>
            </View>
            <Switch
              value={lowFoodAlerts}
              onValueChange={setLowFoodAlerts}
              trackColor={{ false: COLORS.surfaceSecondary, true: COLORS.primaryLight }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Low Water Alerts</Text>
              <Text style={styles.settingDesc}>Alert when water is below 20%</Text>
            </View>
            <Switch
              value={lowWaterAlerts}
              onValueChange={setLowWaterAlerts}
              trackColor={{ false: COLORS.surfaceSecondary, true: COLORS.primaryLight }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Geofence Alerts</Text>
              <Text style={styles.settingDesc}>Alert when pet leaves safe zone</Text>
            </View>
            <Switch
              value={geofenceAlerts}
              onValueChange={setGeofenceAlerts}
              trackColor={{ false: COLORS.surfaceSecondary, true: COLORS.primaryLight }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Device Settings */}
        <Text style={styles.sectionTitle}>Device</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuLabel}>Refresh Interval</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>30 sec</Text>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuLabel}>Battery Saver Mode</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>Off</Text>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuLabel}>Change Password</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuLabel}>Help & Support</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuRow}>
            <Text style={[styles.menuLabel, { color: COLORS.danger }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>Smart Pet v1.0.0</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
  },
  editButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  menuLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginRight: SPACING.xs,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
});
