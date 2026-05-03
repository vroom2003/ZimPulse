// src/theme/typography.js
//
// Font styles matching your design system.
// Manrope for headings (bold, modern, authoritative)
// Inter for body text (high readability)

import { Platform } from 'react-native';

// Font names work differently on iOS vs Android with Expo
const fontFamily = {
  h1: Platform.OS === 'ios' ? 'Manrope' : 'Manrope_700Bold',
  h2: Platform.OS === 'ios' ? 'Manrope' : 'Manrope_700Bold',
  h3: Platform.OS === 'ios' ? 'Manrope' : 'Manrope_600SemiBold',
  bodyLg: Platform.OS === 'ios' ? 'Inter' : 'Inter_400Regular',
  bodyMd: Platform.OS === 'ios' ? 'Inter' : 'Inter_400Regular',
  bodySm: Platform.OS === 'ios' ? 'Inter' : 'Inter_400Regular',
  labelBold: Platform.OS === 'ios' ? 'Inter' : 'Inter_700Bold',
  callout: Platform.OS === 'ios' ? 'Inter' : 'Inter_600SemiBold',
  montserrat: Platform.OS === 'ios' ? 'Montserrat' : 'Montserrat_700Bold',
};

// Standard text styles you can reuse everywhere
export const typography = {
  h1: {
    fontFamily: fontFamily.h1,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64, // -0.02em at 32px
    fontWeight: '700',
  },
  h2: {
    fontFamily: fontFamily.h2,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.24, // -0.01em at 24px
    fontWeight: '700',
  },
  h3: {
    fontFamily: fontFamily.h3,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: fontFamily.bodyLg,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  bodyMd: {
    fontFamily: fontFamily.bodyMd,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodySm: {
    fontFamily: fontFamily.bodySm,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  labelBold: {
    fontFamily: fontFamily.labelBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  callout: {
    fontFamily: fontFamily.callout,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  montserratBold: {
    fontFamily: fontFamily.montserrat,
    fontSize: 32,
    fontWeight: '700',
  },
  // For the tiny tab labels in bottom nav
  tabLabel: {
    fontFamily: fontFamily.montserrat,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
};