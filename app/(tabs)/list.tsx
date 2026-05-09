// app/(tabs)/list.tsx
//
// List Screen - Shows facilities from Supabase with search, filters,
// distance calculation, and Call/Navigate actions.

import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../src/services/supabaseClient';
import { colors } from '../../src/theme/colors';
import { shadows } from '../../src/theme/shadows';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

// ============================================
// TYPES
// ============================================
interface Facility {
  id: number;
  name: string;
  type: string;
  status: string;
  address: string;
  description?: string;
  phone?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  hours?: string;
}

const FALLBACK_FACILITIES: Facility[] = [
  {
    id: 1,
    name: 'Parirenyatwa Group of Hospitals',
    type: 'Hospital',
    status: 'Open',
    address: 'Mazowe St, Harare',
    description: 'Largest referral hospital in Zimbabwe with specialized trauma and maternity wings.',
    phone: '+263 24 2701555',
    latitude: -17.8136,
    longitude: 31.0427
  },
  {
    id: 2,
    name: 'Avenues Clinic',
    type: 'Clinic',
    status: 'Open',
    address: 'Baines Ave, Harare',
    description: 'Private multi-disciplinary hospital providing high-quality healthcare services.',
    phone: '+263 24 2251180',
    latitude: -17.8219,
    longitude: 31.0494
  },
  {
    id: 3,
    name: 'Harare Central Hospital',
    type: 'Hospital',
    status: 'Open',
    address: 'Southerton, Harare',
    description: 'Major government hospital serving the southern districts of Harare.',
    phone: '+263 24 2621100',
    latitude: -17.8547,
    longitude: 31.0286
  },
  {
    id: 4,
    name: 'Corporate 24 Hospital',
    type: 'Hospital',
    status: 'Open',
    address: 'Belgravia, Harare',
    description: '24-hour private emergency and outpatient facility.',
    phone: '+263 86 77000243',
    latitude: -17.8023,
    longitude: 31.0415
  }
];

// ============================================
// CONSTANTS
// ============================================
const FILTER_OPTIONS = ['All Facilities', 'Hospitals', 'Clinics', 'Open Now'];

// ============================================
// COMPONENT
// ============================================
export default function ListScreen() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Facilities');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  // Get user location and fetch facilities on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (e) {
        console.warn('Location error:', e);
      } finally {
        fetchFacilities();
      }
    })();
  }, []);

  // Fetch facilities from Supabase
  async function fetchFacilities() {
    try {
      const { data, error } = await supabase.from('facilities').select('*');
      if (data && data.length > 0) {
        setFacilities(data as Facility[]);
      } else {
        console.log('No data from Supabase, using fallbacks');
        setFacilities(FALLBACK_FACILITIES);
      }
    } catch (error) {
      console.error('Supabase error:', error);
      setFacilities(FALLBACK_FACILITIES);
    } finally {
      setLoading(false);
    }
  }

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  // Add distance to each facility and sort by closest
  const facilitiesWithDistance = facilities.map((f) => {
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        f.latitude,
        f.longitude
      );
      return { ...f, distance };
    }
    return f;
  }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  // Filter facilities based on search and selected filter
  const filteredFacilities = facilitiesWithDistance.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'Hospitals') return f.type === 'hospital';
    if (selectedFilter === 'Clinics') return f.type === 'clinic';
    if (selectedFilter === 'Open Now') return f.status === 'open';

    return true;
  });

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  // Render each filter chip
  const renderFilterItem = (filter: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterChip,
        selectedFilter === filter && styles.filterChipSelected,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter && styles.filterTextSelected,
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  // Render each facility card
  const renderItem = ({ item }: { item: Facility }) => (
    <View style={styles.card}>
      {/* Top Row: Type Badge + Distance */}
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                item.type === 'hospital'
                  ? colors.secondaryContainer
                  : colors.tertiaryFixedDim,
            },
          ]}
        >
          <Text style={styles.typeBadgeText}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.distanceText}>
          {item.distance ? `${item.distance.toFixed(1)} km` : '-- km'}
        </Text>
      </View>

      {/* Name + Status */}
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.status === 'open' ? colors.successGreen : colors.error,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color:
                  item.status === 'open' ? colors.successGreen : colors.error,
              },
            ]}
          >
            {item.status === 'open' ? 'OPEN 24/7' : 'CLOSED'}
          </Text>
        </View>
      </View>

      {/* Address */}
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.address}.{' '}
        {item.description ||
          'Specialized surgical units and critical care.'}
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => item.phone && Linking.openURL(`tel:${item.phone}`)}
        >
          <MaterialIcons name="call" size={20} color={colors.secondary} />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`
            )
          }
        >
          <MaterialIcons name="near-me" size={20} color={colors.white} />
          <Text style={styles.navigateButtonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.darkHeader }}>
        {/* FIXED: Changed <div> to <View> */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HEALTHCARE DIRECTORY</Text>
          <div style={styles.avatarContainer as any}>
             <MaterialIcons name="person" size={20} color={colors.greyInactive} />
          </div>
        </View>
      </SafeAreaView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color={colors.greyInactive} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search emergency facilities nearby..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.greyInactive}
        />
      </View>

      {/* Filter Chips */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {FILTER_OPTIONS.map(renderFilterItem)}
        </ScrollView>
      </View>

      {/* Facility List */}
      <FlatList
        data={filteredFacilities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.emergencyBanner}>
            <View style={styles.emergencyIconContainer}>
              <MaterialIcons name="emergency" size={32} color={colors.primary} />
            </View>
            <View style={styles.emergencyTextContainer}>
              <Text style={styles.emergencyTitle}>Critical Emergency?</Text>
              <Text style={styles.emergencySubtitle}>
                Connect directly with MARS Rapid Response
              </Text>
            </View>
            <TouchableOpacity
              style={styles.sosBannerButton}
              onPress={() => Linking.openURL('tel:999')}
            >
              <Text style={styles.sosBannerButtonText}>CALL SOS</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No facilities found'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ============================================
// STYLES
// ============================================
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
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.marginMobile,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 12,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  filterList: {
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.md,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.surfaceContainerHigh,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.labelBold,
    color: colors.onSurface,
  },
  filterTextSelected: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Inter_700Bold',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    fontFamily: 'Inter_700Bold',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
    flex: 1,
    fontFamily: 'Manrope_700Bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Inter_700Bold',
  },
  cardDescription: {
    fontSize: 14,
    color: colors.greyInactive,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
    fontFamily: 'Inter_600SemiBold',
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  navigateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'Inter_600SemiBold',
  },
  emergencyBanner: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryFixed,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    fontFamily: 'Manrope_700Bold',
  },
  emergencySubtitle: {
    fontSize: 12,
    color: colors.secondary,
    fontFamily: 'Inter_400Regular',
  },
  sosBannerButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sosBannerButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.greyInactive,
  },
});