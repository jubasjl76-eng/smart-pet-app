import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StyleSheet } from 'react-native';
import { FeederScreen, WaterScreen, SettingsScreen, TrackerScreen } from './src/screens';
import { COLORS } from './src/constants';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
  </View>
);

function AppContent() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Tracker"
          component={TrackerScreen}
          options={{
            tabBarLabel: 'GPS',
            tabBarIcon: ({ focused }) => <TabIcon icon="📍" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Feeder"
          component={FeederScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon icon="🐶" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Water"
          component={WaterScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon icon="💧" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 85,
    paddingTop: 8,
    paddingBottom: 25,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
});
