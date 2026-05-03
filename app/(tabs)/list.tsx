import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';
import { supabase } from '@/src/services/supabaseClient';

export default function ListScreen() {
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  async function fetchFacilities() {
    const { data, error } = await supabase.from('facilities').select('*');
    if (data) setFacilities(data);
    setLoading(false);
  }

  const filteredFacilities = facilities.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.type.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={[styles.badge, { backgroundColor: item.status === 'Open' ? colors.successContainer : colors.errorContainer }]}>
          <Text style={[styles.badgeText, { color: item.status === 'Open' ? colors.successGreen : colors.error }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{item.type} • {item.address}</Text>
      <View style={styles.cardFooter}>
        <MaterialIcons name="access-time" size={16} color={colors.greyInactive} />
        <Text style={styles.footerText}>{item.hours || '24 Hours'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Healthcare Facilities</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={colors.greyInactive} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hospitals, clinics..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredFacilities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    margin: spacing.marginMobile,
    paddingHorizontal: spacing.sm,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.xs,
    ...typography.bodyMd,
  },
  listContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.gutter,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    ...typography.callout,
    color: colors.onSurface,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    ...typography.labelBold,
    fontSize: 10,
  },
  cardSubtitle: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.greyInactive,
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
