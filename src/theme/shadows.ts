// src/theme/shadows.js
//
// Shadow presets matching your design's elevation system.
// iOS uses shadowColor/shadowOffset/shadowOpacity/shadowRadius
// Android uses elevation (0-24 scale)

import { Platform } from 'react-native';

export const shadows = {
  // Standard card shadow
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
    },
    android: {
      elevation: 3,
    },
  }),

  // Elevated card (hover state)
  cardElevated: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
    },
    android: {
      elevation: 6,
    },
  }),

  // SOS button glow
  sosGlow: Platform.select({
    ios: {
      shadowColor: '#E53935',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
    },
    android: {
      elevation: 8,
    },
  }),

  // Bottom navigation shadow
  bottomNav: Platform.select({
    ios: {
      shadowColor: '#E53935',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
    android: {
      elevation: 10,
    },
  }),

  // Header shadow
  header: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
    },
    android: {
      elevation: 12,
    },
  }),
};