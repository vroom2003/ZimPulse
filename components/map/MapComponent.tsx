import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { shadows } from '@/src/theme/shadows';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/src/services/supabaseClient';

export default function MapScreen() {
  const [facilities, setFacilities] = useState<any[]>([]);

  useEffect(() => {
    fetchFacilities();
  }, []);

  async function fetchFacilities() {
    try {
      const { data } = await supabase.from('facilities').select('*');
      if (data) setFacilities(data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.darkHeader }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NEARBY FACILITIES</Text>
          <View style={styles.filterBadge}>
            <MaterialIcons name="tune" size={16} color={colors.white} />
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121541.341490214!2d31.0335!3d-17.8252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4e78444c13d%3A0x40c313a3c25b420!2sHarare%2C%20Zimbabwe!5e0!3m2!1sen!2szw!4v1652100000000!5m2!1sen!2szw"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
          />
        ) : (
          <View style={styles.center}>
            <MaterialIcons name="map" size={64} color={colors.outlineVariant} />
            <Text style={styles.webFallback}>Interactive Map View</Text>
            <Text style={styles.webFallbackSub}>Native mapping services active</Text>
          </View>
        )}

        {/* Floating Info Card */}
        <View style={styles.floatingCard}>
          <View style={styles.cardIndicator} />
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Find Healthcare</Text>
            <Text style={styles.cardDistance}>Within 5km</Text>
          </View>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={colors.greyInactive} />
            <Text style={styles.searchPlaceholder}>Search hospital or clinic...</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    fontSize: 14,
    letterSpacing: 2,
    color: colors.white,
  },
  filterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webFallback: {
    ...(typography.h3 as any),
    color: colors.onSurfaceVariant,
    marginTop: 16,
  },
  webFallbackSub: {
    ...(typography.bodySm as any),
    color: colors.greyInactive,
    marginTop: 4,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    ...shadows.cardElevated,
    zIndex: 10,
  },
  cardIndicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.outlineVariant,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    ...(typography.h2 as any),
    color: colors.onSurface,
  },
  cardDistance: {
    ...(typography.labelBold as any),
    color: colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchPlaceholder: {
    ...(typography.bodyMd as any),
    color: colors.greyInactive,
  },
});
