// src/screens/HomeScreen.js
//
// The main landing screen with:
// - Header with location and user avatar
// - Large SOS button
// - Find Nearby Help button
// - System status cards
// - Rapid actions

import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabaseClient';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function HomeScreen({ navigation }) {
  // State for dynamic data
  const [facilitiesCount, setFacilitiesCount] = useState(3); // Default
  const [guardiansCount, setGuardiansCount] = useState(3); // Default
  const [systemReady, setSystemReady] = useState(true);

  // Fetch live data from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Count facilities
      const { count: facCount } = await supabase
        .from('facilities')
        .select('*', { count: 'exact', head: true });
      if (facCount) setFacilitiesCount(facCount);

      // Count guardians
      const { count: guardCount } = await supabase
        .from('guardians')
        .select('*', { count: 'exact', head: true });
      if (guardCount) setGuardiansCount(guardCount);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSystemReady(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ========== HEADER ========== */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="location-on" size={20} color={colors.sosRed} />
          <Text style={styles.headerTitle}>Harare Central</Text>
        </View>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={24} color={colors.greyInactive} />
        </View>
      </View>

      {/* ========== SCROLLABLE CONTENT ========== */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========== SOS BUTTON ========== */}
        <TouchableOpacity
          style={styles.sosButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SOS')}
        >
          <MaterialIcons
            name="emergency"
            size={48}
            color={colors.white}
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
          <Text style={styles.sosButtonText}>EMERGENCY SOS</Text>
        </TouchableOpacity>

        {/* ========== FIND NEARBY HELP BUTTON ========== */}
        <TouchableOpacity
          style={styles.findHelpButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Map')}
        >
          <MaterialIcons name="search" size={20} color={colors.onSecondaryContainer} />
          <Text style={styles.findHelpText}>Find Nearby Help</Text>
        </TouchableOpacity>

        {/* ========== SYSTEM STATUS ========== */}
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusGrid}>
          {/* System Ready Card */}
          <View style={styles.statusCardLarge}>
            <View>
              <Text style={styles.statusLabel}>System Status</Text>
              <Text style={styles.statusValue}>
                {systemReady ? 'System Ready' : 'Reconnecting...'}
              </Text>
            </View>
            <View style={styles.checkCircle}>
              <MaterialIcons
                name="check-circle"
                size={32}
                color={colors.onTertiaryContainer}
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
            </View>
          </View>

          {/* Facilities Count */}
          <View style={styles.statusCard}>
            <MaterialIcons
              name="local-hospital"
              size={32}
              color={colors.secondary}
            />
            <Text style={styles.statNumber}>{facilitiesCount} Nearby</Text>
            <Text style={styles.statLabel}>Facilities active</Text>
          </View>

          {/* Response Time */}
          <View style={styles.statusCard}>
            <MaterialIcons name="timer" size={32} color={colors.primary} />
            <Text style={styles.statNumber}>4m Avg</Text>
            <Text style={styles.statLabel}>Response time</Text>
          </View>
        </View>

        {/* ========== RAPID ACTIONS ========== */}
        <Text style={styles.sectionTitle}>Rapid Actions</Text>
        <View style={styles.actionsList}>
          {/* Request Ambulance */}
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: colors.errorContainer }]}>
              <MaterialIcons name="ambulance" size={24} color={colors.onErrorContainer} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Request Ambulance</Text>
              <Text style={styles.actionSubtitle}>Fast-track dispatch service</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          {/* Emergency Care Tips */}
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: colors.secondaryFixed }]}>
              <MaterialIcons name="medical-services" size={24} color={colors.onSecondaryFixed} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Emergency Care Tips</Text>
              <Text style={styles.actionSubtitle}>First-aid guidance during crisis</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    backgroundColor: colors.darkHeader,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBorder,
    ...shadows.header,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.sosRed,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.marginMobile,
    paddingBottom: spacing.lg,
  },

  // SOS Button
  sosButton: {
    backgroundColor: colors.primary,
    width: 224, // 56 * 4 = 224px (large circle-ish)
    height: 224,
    borderRadius: 112, // Half of width/height = perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    ...shadows.sosGlow,
  },
  sosButtonText: {
    color: colors.white,
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'Montserrat_700Bold',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: spacing.xs,
  },

  // Find Help Button
  findHelpButton: {
    backgroundColor: colors.secondaryContainer,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: 12,
    marginBottom: spacing.lg,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
  },
  findHelpText: {
    ...typography.callout,
    color: colors.onSecondaryContainer,
  },

  // Section Title
  sectionTitle: {
    ...typography.h2,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },

  // Status Grid
  statusGrid: {
    gap: spacing.gutter,
    marginBottom: spacing.lg,
  },
  statusCardLarge: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.card,
  },
  statusLabel: {
    ...typography.labelBold,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  statusValue: {
    ...typography.h2,
    color: colors.onSurface,
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.tertiaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.card,
  },
  statNumber: {
    ...typography.h3,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },

  // Action Items
  actionsList: {
    gap: spacing.sm,
  },
  actionItem: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    ...typography.callout,
    color: colors.onSurface,
  },
  actionSubtitle: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
});