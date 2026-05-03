import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';
import { shadows } from '@/src/theme/shadows';
import { supabase } from '@/src/services/supabaseClient';

const FILTER_OPTIONS = ['All Facilities', 'Hospitals', 'Clinics', 'Open Now'];

export default function ListScreen() {
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Facilities');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  async function fetchFacilities() {
    const { data, error } = await supabase.from('facilities').select('*');
    if (data) setFacilities(data);
    setLoading(false);
  }

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                         f.type.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'Hospitals') return f.type === 'Hospital';
    if (selectedFilter === 'Clinics') return f.type === 'Clinic';
    if (selectedFilter === 'Open Now') return f.status === 'Open';

    return true;
  });

  const renderFilterItem = (filter) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterChip,
        selectedFilter === filter && styles.filterChipSelected
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === filter && styles.filterTextSelected
      ]}>
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: item.type === 'Hospital' ? '#4285F4' : '#FBBC05' }]}>
          <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.distanceText}>1.2 km</Text>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.statusRow}>
           <View style={[styles.statusDot, { backgroundColor: item.status === 'Open' ? '#34A853' : '#EA4335' }]} />
           <Text style={[styles.statusText, { color: item.status === 'Open' ? '#34A853' : '#EA4335' }]}>
             {item.status === 'Open' ? 'OPEN 24/7' : 'CLOSED'}
           </Text>
        </View>
      </View>

      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.address}. {item.description || 'Level 4 Trauma Center with specialized surgical units and critical care.'}
      </Text>

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
          onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`)}
        >
          <MaterialIcons name="near-me" size={20} color={colors.white} />
          <Text style={styles.navigateButtonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Custom Header matching screen1.png */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="location-on" size={24} color={colors.sosRed} />
          <Text style={styles.headerTitle}>HARARE CENTRAL</Text>
        </View>
        <View style={styles.avatarContainer}>
           <MaterialIcons name="person" size={24} color={colors.greyInactive} />
        </View>
      </View>

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

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {FILTER_OPTIONS.map(renderFilterItem)}
        </ScrollView>
      </View>

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
              <Text style={styles.emergencySubtitle}>Connect directly with MARS Rapid Response</Text>
            </View>
            <TouchableOpacity style={styles.sosBannerButton}>
               <Text style={styles.sosBannerButtonText}>CALL SOS</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{loading ? 'Loading...' : 'No facilities found'}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 64,
    backgroundColor: colors.darkHeader,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '800',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
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
    backgroundColor: '#E8E8E8',
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
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
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
  },
  cardDescription: {
    fontSize: 14,
    color: colors.greyInactive,
    lineHeight: 20,
    marginBottom: 16,
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
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
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
  },
  emergencyBanner: {
    flexDirection: 'row',
    backgroundColor: '#D7E5FF',
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
  },
  emergencySubtitle: {
    fontSize: 12,
    color: colors.secondary,
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
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.greyInactive,
  }
});
