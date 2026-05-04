import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { shadows } from '@/src/theme/shadows';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapScreen() {
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
        <View style={styles.center}>
          <MaterialIcons name="map" size={64} color={colors.outlineVariant} />
          <Text style={styles.webFallback}>Interactive Map View</Text>
          <Text style={styles.webFallbackSub}>Native mapping services active</Text>
        </View>

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
    backgroundColor: '#E0E0E0', // Placeholder map color
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webFallback: {
    ...typography.h3,
    color: colors.onSurfaceVariant,
    marginTop: 16,
  },
  webFallbackSub: {
    ...typography.bodySm,
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
    ...typography.h2,
    color: colors.onSurface,
  },
  cardDistance: {
    ...typography.labelBold,
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
    ...typography.bodyMd,
    color: colors.greyInactive,
  },
});
