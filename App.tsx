import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { FeederScreen, WaterScreen, SettingsScreen } from './src/screens';
import { COLORS } from './src/constants';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
});
