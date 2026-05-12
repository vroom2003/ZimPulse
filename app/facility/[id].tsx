import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';
import { shadows } from '@/src/theme/shadows';
import { supabase } from '@/src/services/supabaseClient';

export default function FacilityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacility();
  }, [id]);

  async function fetchFacility() {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setFacility(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;
  if (!facility) return (
    <View style={styles.center}>
      <Text>Facility not found</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: colors.primary, marginTop: 20 }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const isOpen = facility.status?.toLowerCase() === 'open';

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.darkHeader }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HARARE CENTRAL</Text>
          <View style={styles.avatarContainer}>
             <MaterialIcons name="person" size={20} color={colors.greyInactive} />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
             <View style={styles.traumaBadge}>
                <MaterialIcons name="emergency" size={14} color={colors.white} />
                <Text style={styles.traumaBadgeText}>LEVEL 1 TRAUMA CENTER</Text>
             </View>
             <Text style={styles.heroTitle}>{facility.name}</Text>
             <Text style={styles.heroZimPulse}>ZimPulse</Text>
             <Text style={styles.heroTagline}>EVERY HEARTBEAT COUNTS.</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
           <View style={styles.infoRow}>
              <View style={styles.statusSection}>
                 <View style={styles.statusHeader}>
                    <View style={[styles.statusDot, { backgroundColor: isOpen ? colors.secondary : colors.error }]} />
                    <Text style={[styles.statusText, { color: colors.secondary }]}>
                        {isOpen ? 'Open Now - 24/7 Emergency' : 'Closed'}
                    </Text>
                 </View>
                 <Text style={styles.addressText}>{facility.address}, Zimbabwe</Text>
              </View>
              <View style={styles.waitSection}>
                 <Text style={styles.waitLabel}>WAIT TIME</Text>
                 <Text style={styles.waitValue}>~{facility.wait_time || 15}</Text>
                 <Text style={styles.waitUnit}>mins</Text>
              </View>
           </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => facility.phone && Linking.openURL(`tel:${facility.phone}`)}
            >
                <MaterialIcons name="call" size={24} color={colors.primary} />
                <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionButton, styles.navigateButton]}
                onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`)}
            >
                <MaterialIcons name="near-me" size={24} color={colors.white} />
                <Text style={[styles.actionButtonText, { color: colors.white }]}>Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="share" size={24} color={colors.onSurfaceVariant} />
                <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="medical-services" size={24} color={colors.tertiary} />
                <Text style={styles.sectionTitle}>Services</Text>
            </View>
            <View style={styles.servicesGrid}>
                {['ER', 'ICU', 'X-Ray', 'Lab'].map((service) => (
                    <View key={service} style={styles.serviceItem}>
                        <MaterialIcons
                            name={service === 'ER' ? 'emergency' : service === 'ICU' ? 'airline-seat-flat' : service === 'X-Ray' ? 'grid-on' : 'biotech'}
                            size={20}
                            color={colors.secondary}
                        />
                        <Text style={styles.serviceText}>{service}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Operating Hours */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="access-time" size={24} color={colors.secondary} />
                <Text style={styles.sectionTitle}>Operating Hours</Text>
            </View>
            <View style={styles.hoursList}>
                <View style={styles.hoursRow}>
                    <Text style={[styles.hoursDay, { color: colors.primary }]}>Monday - Sunday</Text>
                    <Text style={styles.hoursValue}>24 Hours</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursDay}>Outpatient Clinic</Text>
                    <Text style={styles.hoursValue}>08:00 - 17:00</Text>
                </View>
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursDay}>Pharmacy</Text>
                    <Text style={styles.hoursValue}>07:00 - 22:00</Text>
                </View>
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursDay}>Visiting Hours</Text>
                    <Text style={styles.hoursValue}>13:00 - 14:00</Text>
                </View>
            </View>
        </View>

        {/* Map Preview */}
        <View style={styles.mapPreview}>
            <View style={styles.mapPlaceholder}>
                 <MaterialIcons name="map" size={48} color={colors.outlineVariant} />
            </View>
            <View style={styles.trafficBadge}>
                <Text style={styles.trafficText}>LIVE TRAFFIC DATA</Text>
            </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  header: {
    height: 60,
    backgroundColor: colors.darkHeader,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: colors.white,
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
  content: {
      flex: 1,
  },
  hero: {
      height: 300,
      backgroundColor: colors.surfaceDim,
      position: 'relative',
  },
  heroImage: {
      width: '100%',
      height: '100%',
      opacity: 0.6,
  },
  heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      padding: 20,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.3)',
  },
  traumaBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
      marginBottom: 12,
  },
  traumaBadgeText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '800',
  },
  heroTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: colors.white,
      lineHeight: 36,
      marginBottom: 8,
  },
  heroZimPulse: {
      fontSize: 48,
      fontWeight: '900',
      color: 'rgba(255, 255, 255, 0.2)',
      marginTop: -20,
  },
  heroTagline: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.white,
      letterSpacing: 2,
  },
  infoCard: {
      backgroundColor: colors.white,
      margin: 16,
      marginTop: -30,
      borderRadius: 16,
      padding: 20,
      ...shadows.cardElevated,
  },
  infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  statusSection: {
      flex: 1,
  },
  statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
  },
  statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
  },
  statusText: {
      fontSize: 16,
      fontWeight: '700',
  },
  addressText: {
      fontSize: 14,
      color: colors.greyInactive,
  },
  waitSection: {
      alignItems: 'flex-end',
  },
  waitLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.greyInactive,
  },
  waitValue: {
      fontSize: 32,
      fontWeight: '900',
      color: colors.primary,
      lineHeight: 36,
  },
  waitUnit: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.primary,
      marginTop: -5,
  },
  actionRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 12,
      marginBottom: 24,
  },
  actionButton: {
      flex: 1,
      backgroundColor: colors.surfaceContainerLow,
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      gap: 4,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
  },
  navigateButton: {
      backgroundColor: colors.secondaryContainer,
      borderColor: colors.secondary,
  },
  actionButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.onSurface,
  },
  section: {
      paddingHorizontal: 16,
      marginBottom: 24,
  },
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.onSurface,
  },
  servicesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
  },
  serviceItem: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceContainerLow,
      padding: 12,
      borderRadius: 8,
      gap: 12,
  },
  serviceText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.onSurface,
  },
  hoursList: {
      backgroundColor: colors.white,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      gap: 12,
  },
  hoursRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  hoursDay: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.onSurface,
  },
  hoursValue: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
  },
  separator: {
      height: 1,
      backgroundColor: colors.outlineVariant,
  },
  mapPreview: {
      marginHorizontal: 16,
      height: 180,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.surfaceDim,
      position: 'relative',
  },
  mapPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  trafficBadge: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: colors.white,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      ...shadows.card,
  },
  trafficText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.onSurface,
  }
});
