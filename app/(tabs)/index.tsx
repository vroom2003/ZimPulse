import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/services/supabaseClient';
import { colors } from '@/src/theme/colors';
import { shadows } from '@/src/theme/shadows';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';

export default function HomeScreen() {
  const router = useRouter();
  const [facilitiesCount, setFacilitiesCount] = useState(3);
  const [systemReady, setSystemReady] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { count: facCount } = await supabase
        .from('facilities')
        .select('*', { count: 'exact', head: true });
      if (facCount) setFacilitiesCount(facCount);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSystemReady(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.darkHeader }}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerRight}>
            <View style={styles.locationBadge}>
              <MaterialIcons name="location-on" size={14} color={colors.sosRed} />
              <Text style={styles.locationText}>HARARE</Text>
            </View>
            <View style={styles.avatarContainer}>
               <MaterialIcons name="person" size={20} color={colors.greyInactive} />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroGreeting}>Hello, User</Text>
          <Text style={styles.heroSubtext}>Emergency services are on standby</Text>
        </View>

        {/* ========== SOS SECTION ========== */}
        <View style={styles.sosSection}>
             <TouchableOpacity
              style={styles.sosButton}
              activeOpacity={0.8}
              onPress={() => router.push('/sos')}
            >
              <MaterialIcons
                name="emergency"
                size={80}
                color={colors.white}
              />
              <Text style={styles.sosButtonText}>SOS</Text>
            </TouchableOpacity>

            <View style={styles.tagLineContainer}>
                <Text style={styles.brandTitle}>ZimPulse</Text>
                <Text style={styles.brandTagline}>EVERY HEARTBEAT COUNTS.</Text>
            </View>
        </View>

        {/* ========== MAIN ACTIONS ========== */}
        <View style={styles.actionGrid}>
            <TouchableOpacity
                style={styles.mainActionCard}
                onPress={() => router.push('/map')}
            >
                <View style={[styles.actionIconContainer, { backgroundColor: '#E3F2FD' }]}>
                    <MaterialIcons name="map" size={32} color={colors.secondary} />
                </View>
                <Text style={styles.actionCardTitle}>Find Help</Text>
                <Text style={styles.actionCardSubtitle}>Nearby facilities</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.mainActionCard}
                onPress={() => router.push('/list')}
            >
                <View style={[styles.actionIconContainer, { backgroundColor: '#F1F8E9' }]}>
                    <MaterialIcons name="format-list-bulleted" size={32} color={colors.successGreen} />
                </View>
                <Text style={styles.actionCardTitle}>Facility List</Text>
                <Text style={styles.actionCardSubtitle}>All healthcare</Text>
            </TouchableOpacity>
        </View>

        {/* ========== SYSTEM STATUS ========== */}
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusCardLarge}>
            <View>
              <Text style={styles.statusLabel}>Network Status</Text>
              <Text style={styles.statusValue}>
                {systemReady ? 'System Ready' : 'Reconnecting...'}
              </Text>
            </View>
            <View style={styles.checkCircle}>
              <MaterialIcons
                name="check-circle"
                size={32}
                color={colors.successGreen}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.gutter }}>
              <View style={[styles.statusCard, { flex: 1 }]}>
                <MaterialIcons
                  name="local-hospital"
                  size={32}
                  color={colors.secondary}
                />
                <Text style={styles.statNumber}>{facilitiesCount} Active</Text>
                <Text style={styles.statLabel}>Facilities online</Text>
              </View>

              <View style={[styles.statusCard, { flex: 1 }]}>
                <MaterialIcons name="timer" size={32} color={colors.primary} />
                <Text style={styles.statNumber}>4m Avg</Text>
                <Text style={styles.statLabel}>Response time</Text>
              </View>
          </View>
        </View>

        {/* ========== RAPID ACTIONS ========== */}
        <Text style={styles.sectionTitle}>Rapid Actions</Text>
        <View style={styles.actionsList}>
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => Linking.openURL('tel:999')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.errorContainer }]}>
              <FontAwesome5 name="ambulance" size={20} color={colors.onErrorContainer} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Request Ambulance</Text>
              <Text style={styles.actionSubtitle}>Direct call to dispatch center</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push('/guardians' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.secondaryFixed }]}>
              <MaterialIcons name="people" size={24} color={colors.onSecondaryFixed} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Manage Guardians</Text>
              <Text style={styles.actionSubtitle}>Trusted emergency contacts</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => Linking.openURL('https://www.redcross.org/get-help/how-to-prepare-for-emergencies/hands-only-cpr.html')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFF9C4' }]}>
              <MaterialIcons name="medical-services" size={24} color={colors.tertiary} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Emergency Care Tips</Text>
              <Text style={styles.actionSubtitle}>First-aid guidance during crisis</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.darkHeader,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
    height: 70,
    ...shadows.header,
  },
  logo: {
    height: 40,
    width: 120,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  locationText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.marginMobile,
    paddingBottom: spacing.lg,
  },
  heroSection: {
    marginBottom: spacing.lg,
  },
  heroGreeting: {
    ...typography.h1,
    color: colors.onSurface,
    fontSize: 32,
    fontWeight: '800',
  },
  heroSubtext: {
    ...typography.bodyMd,
    color: colors.greyInactive,
    marginTop: 4,
  },
  sosSection: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    marginBottom: 40,
  },
  sosButton: {
    backgroundColor: colors.primary,
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sosGlow,
    zIndex: 2,
  },
  sosButtonText: {
    color: colors.white,
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    fontWeight: '900',
  },
  tagLineContainer: {
      marginTop: -40,
      paddingTop: 50,
      alignItems: 'center',
      width: '100%',
  },
  brandTitle: {
      fontSize: 48,
      fontWeight: '900',
      color: 'rgba(175, 16, 26, 0.1)',
      position: 'absolute',
      top: 10,
  },
  brandTagline: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 2,
  },
  actionGrid: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 32,
  },
  mainActionCard: {
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      ...shadows.card,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
  },
  actionIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
  },
  actionCardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onSurface,
  },
  actionCardSubtitle: {
      fontSize: 12,
      color: colors.greyInactive,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  statusGrid: {
    gap: spacing.gutter,
    marginBottom: spacing.lg,
  },
  statusCardLarge: {
    backgroundColor: colors.white,
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
    color: colors.greyInactive,
    textTransform: 'uppercase',
  },
  statusValue: {
    ...typography.h2,
    color: colors.onSurface,
    marginTop: 4,
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    backgroundColor: colors.white,
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
    color: colors.greyInactive,
  },
  actionsList: {
    gap: spacing.sm,
  },
  actionItem: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
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
    color: colors.greyInactive,
  },
});
