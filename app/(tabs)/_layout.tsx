import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '@/src/theme/colors';
import { shadows } from '@/src/theme/shadows';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.sosRed,
        tabBarInactiveTintColor: colors.greyInactive,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="format-list-bulleted" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="emergency" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(10, 10, 10, 0.98)',
    borderTopColor: 'rgba(175, 16, 26, 0.3)',
    borderTopWidth: 1.5,
    height: Platform.OS === 'ios' ? 92 : 72,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 32 : 8,
    ...shadows.bottomNav,
  },
  tabLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: -4,
  },
});
