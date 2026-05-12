import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { shadows } from '@/src/theme/shadows';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/src/services/supabaseClient';

import { useRouter } from 'expo-router';

export default function MapScreen() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const router = useRouter();

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

          {selectedFacility ? (
             <TouchableOpacity
                style={styles.selectedCard}
                onPress={() => router.push(`/facility/${selectedFacility.id}` as any)}
             >
                <View style={styles.selectedHeader}>
                   <View style={[styles.typeBadge, { backgroundColor: selectedFacility.type?.toLowerCase() === 'hospital' ? colors.secondary : colors.tertiaryContainer }]}>
                      <Text style={styles.typeBadgeText}>{(selectedFacility.type || '').toUpperCase()}</Text>
                   </View>
                   <Text style={styles.waitTimeText}>{selectedFacility.wait_time || 15} mins</Text>
                </View>
                <Text style={styles.selectedTitle}>{selectedFacility.name}</Text>
                <Text style={styles.selectedAddress}>{selectedFacility.address}</Text>
                <View style={styles.cardButtons}>
                    <View style={styles.miniButton}>
                        <MaterialIcons name="call" size={18} color={colors.secondary} />
                        <Text style={styles.miniButtonText}>Call</Text>
                    </View>
                    <View style={[styles.miniButton, { backgroundColor: colors.primary }]}>
                        <MaterialIcons name="near-me" size={18} color={colors.white} />
                        <Text style={[styles.miniButtonText, { color: colors.white }]}>Navigate</Text>
                    </View>
                </View>
             </TouchableOpacity>
          ) : (
            <>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Find Healthcare</Text>
                <Text style={styles.cardDistance}>Within 5km</Text>
              </View>
              <TouchableOpacity
                style={styles.searchBar}
                onPress={() => facilities.length > 0 && setSelectedFacility(facilities[0])}
              >
                <MaterialIcons name="search" size={20} color={colors.greyInactive} />
                <Text style={styles.searchPlaceholder}>Search hospital or clinic...</Text>
              </TouchableOpacity>
            </>
          )}
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
  selectedCard: {
      gap: 8,
  },
  selectedHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  typeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
  },
  typeBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.white,
  },
  waitTimeText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
  },
  selectedTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.onSurface,
  },
  selectedAddress: {
      fontSize: 14,
      color: colors.greyInactive,
  },
  cardButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
  },
  miniButton: {
      flex: 1,
      flexDirection: 'row',
      height: 40,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
  },
  miniButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.secondary,
  }
});
