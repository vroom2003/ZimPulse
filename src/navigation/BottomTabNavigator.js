// src/navigation/BottomTabNavigator.js
//
// This creates the bottom navigation bar with 4 tabs:
// Home, Map, List, SOS
// It matches your Stitch design exactly.

import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import ListScreen from '../screens/ListScreen';
import MapScreen from '../screens/MapScreen';
import SOSScreen from '../screens/SOSScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        // Tab bar styling - matches your dark design
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.sosRed, // Active tab = red
        tabBarInactiveTintColor: colors.greyInactive, // Inactive = grey
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false, // We'll add custom headers per screen
      }}
    >
      {/* HOME TAB */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* MAP TAB */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />

      {/* LIST TAB */}
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          tabBarLabel: 'List',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="format-list-bulleted" size={size} color={color} />
          ),
        }}
      />

      {/* SOS TAB */}
      <Tab.Screen
        name="SOS"
        component={SOSScreen}
        options={{
          tabBarLabel: 'SOS',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="emergency" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)', // #141414 with 90% opacity
    borderTopColor: colors.darkBorder,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 72, // Account for safe area on iOS
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    ...shadows.bottomNav,
  },
  tabLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'Montserrat_700Bold',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});