import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { shadows } from '@/src/theme/shadows';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/src/services/supabaseClient';
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (e) {
        setErrorMsg('Could not fetch location');
      }

      const { data, error } = await supabase.from('facilities').select('*');
      if (data) setFacilities(data);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeHeader} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NEARBY FACILITIES</Text>
          <View style={styles.filterBadge}>
            <MaterialIcons name="tune" size={16} color={colors.white} />
          </View>
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.coords.latitude || -17.8252,
              longitude: location?.coords.longitude || 31.0335,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
            onPress={() => setSelectedFacility(null)}
          >
            {facilities.map((f: any) => (
              <Marker
                key={f.id}
                coordinate={{ latitude: f.latitude, longitude: f.longitude }}
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedFacility(f);
                }}
              >
                 <View style={[styles.customMarker, { backgroundColor: f.type?.toLowerCase() === 'hospital' ? colors.primary : colors.secondary }]}>
                    <MaterialIcons
                        name={f.type?.toLowerCase() === 'hospital' ? "local-hospital" : "medical-services"}
                        size={18}
                        color={colors.white}
                    />
                 </View>
              </Marker>
            ))}
          </MapView>

          {/* Floating Card */}
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
                     <Text style={styles.waitTimeText}>{selectedFacility.wait_time || 15} mins wait</Text>
                  </View>
                  <Text style={styles.selectedTitle}>{selectedFacility.name}</Text>
                  <Text style={styles.selectedAddress}>{selectedFacility.address}</Text>

                  <View style={styles.cardButtons}>
                    <TouchableOpacity style={styles.miniButton}>
                        <MaterialIcons name="call" size={18} color={colors.secondary} />
                        <Text style={styles.miniButtonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.miniButton, { backgroundColor: colors.primary }]}>
                        <MaterialIcons name="near-me" size={18} color={colors.white} />
                        <Text style={[styles.miniButtonText, { color: colors.white }]}>Navigate</Text>
                    </TouchableOpacity>
                  </View>
               </TouchableOpacity>
            ) : (
              <>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Find Healthcare</Text>
                  <Text style={styles.cardDistance}>Within 5km</Text>
                </View>
                <View style={styles.searchBar}>
                  <MaterialIcons name="search" size={20} color={colors.greyInactive} />
                  <Text style={styles.searchPlaceholder}>Search hospital or clinic...</Text>
                </View>
              </>
            )}
          </View>
        </View>
      )}
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeHeader: {
    backgroundColor: colors.darkHeader,
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
  map: {
    flex: 1,
  },
  customMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    ...shadows.card,
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
  },
  cardDistance: {
    fontSize: 14,
    fontWeight: '700',
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
    fontSize: 16,
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
  },
  selectedAddress: {
    fontSize: 14,
    color: colors.greyInactive,
    marginBottom: 4,
  },
  cardButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  miniButton: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  miniButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,0,0,0.7)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
  }
});
