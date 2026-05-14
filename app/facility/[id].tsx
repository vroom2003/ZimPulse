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
      <View style={styles.heroBackground} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FACILITY DETAILS</Text>
          <View style={styles.avatarContainer}>
             <MaterialIcons name="person" size={20} color={colors.greyInactive} />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroOverlay}>
             <View style={styles.traumaBadge}>
                <MaterialIcons name="emergency" size={14} color={colors.white} />
                <Text style={styles.traumaBadgeText}>LEVEL 1 TRAUMA CENTER</Text>
             </View>
             <Text style={styles.heroTitle}>{facility.name}</Text>
             <Text style={styles.heroSubTitle}>Emergency Medical Facility</Text>
             <View style={styles.brandBadge}>
                <Text style={styles.brandTagline}>ZIMPULSE VERIFIED</Text>
             </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
           <View style={styles.infoRow}>
              <View style={styles.statusSection}>
                 <View style={styles.statusHeader}>
                    <View style={[styles.statusDot, { backgroundColor: isOpen ? colors.success : colors.error }]} />
                    <Text style={[styles.statusText, { color: isOpen ? colors.success : colors.error }]}>
                        {isOpen ? 'Open Now - 24/7' : 'Closed'}
                    </Text>
                 </View>
                 <Text style={styles.addressText}>{facility.address}, Harare</Text>
              </View>
              <View style={styles.waitSection}>
                 <Text style={styles.waitLabel}>WAIT TIME</Text>
                 <Text style={styles.waitValue}>{facility.wait_time || 15}</Text>
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
                <MaterialIcons name="share" size={24} color={colors.secondary} />
                <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="medical-services" size={24} color={colors.secondary} />
                <Text style={styles.sectionTitle}>Available Services</Text>
            </View>
            <View style={styles.servicesGrid}>
                {(facility.services && facility.services.length > 0 ? facility.services : ['ER', 'ICU', 'X-Ray', 'Laboratory', 'Pharmacy', 'Surgery']).map((service: string) => (
                    <View key={service} style={styles.serviceItem}>
                        <MaterialIcons
                            name="check-circle"
                            size={16}
                            color={colors.success}
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
                    <Text style={[styles.hoursDay, { color: colors.primary }]}>Emergency Room</Text>
                    <Text style={styles.hoursValue}>24 Hours</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursDay}>General Clinic</Text>
                    <Text style={styles.hoursValue}>08:00 - 18:00</Text>
                </View>
                <View style={styles.hoursRow}>
                    <Text style={styles.hoursDay}>Pharmacy</Text>
                    <Text style={styles.hoursValue}>07:00 - 22:00</Text>
                </View>
            </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: colors.darkHeader,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  header: {
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.6)',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
      flex: 1,
  },
  hero: {
      height: 200,
      paddingHorizontal: 20,
      justifyContent: 'center',
  },
  heroOverlay: {
      paddingVertical: 10,
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
      fontSize: 10,
      fontWeight: '800',
  },
  heroTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: colors.white,
      lineHeight: 36,
  },
  heroSubTitle: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 4,
  },
  brandBadge: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.tertiary,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  brandTagline: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.tertiary,
      letterSpacing: 1,
  },
  infoCard: {
      backgroundColor: colors.white,
      margin: 20,
      marginTop: 10,
      borderRadius: 20,
      padding: 24,
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
      color: colors.textSecondary,
      marginTop: 4,
  },
  waitSection: {
      alignItems: 'flex-end',
  },
  waitLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textTertiary,
  },
  waitValue: {
      fontSize: 36,
      fontWeight: '900',
      color: colors.primary,
      lineHeight: 40,
  },
  waitUnit: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.primary,
      marginTop: -5,
  },
  actionRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 32,
  },
  actionButton: {
      flex: 1,
      backgroundColor: colors.white,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      gap: 6,
      ...shadows.card,
  },
  navigateButton: {
      backgroundColor: colors.primary,
  },
  actionButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textPrimary,
  },
  section: {
      paddingHorizontal: 20,
      marginBottom: 32,
  },
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.textPrimary,
  },
  servicesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
  },
  serviceItem: {
      width: '31%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 95, 175, 0.05)',
      padding: 10,
      borderRadius: 10,
      gap: 6,
  },
  serviceText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.secondary,
  },
  hoursList: {
      backgroundColor: colors.white,
      padding: 20,
      borderRadius: 16,
      ...shadows.card,
      gap: 12,
  },
  hoursRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  hoursDay: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
  },
  hoursValue: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
  },
  separator: {
      height: 1,
      backgroundColor: colors.background,
  },
});
