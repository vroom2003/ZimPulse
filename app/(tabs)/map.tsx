import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { supabase } from '@/src/services/supabaseClient';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nearby Help</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.webFallback}>Maps are only available on native devices.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Native implementation
  try {
      const MapView = require('react-native-maps').default;
      const { Marker } = require('react-native-maps');

      if (!MapView || !Marker) {
          throw new Error('MapView or Marker not found');
      }

      return (
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Nearby Help</Text>
          </View>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location?.coords.latitude || -17.8252,
                longitude: location?.coords.longitude || 31.0335,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showUserLocation={true}
            >
              {facilities.map((f) => (
                <Marker
                  key={f.id}
                  coordinate={{ latitude: f.latitude, longitude: f.longitude }}
                  title={f.name}
                  description={f.type}
                  pinColor={f.type === 'Hospital' ? colors.primary : colors.secondary}
                />
              ))}
            </MapView>
          )}
          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        </SafeAreaView>
      );
  } catch (e) {
      console.error(e);
      return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nearby Help</Text>
            </View>
            <View style={styles.center}>
                <Text style={styles.webFallback}>Map failed to load on this platform.</Text>
            </View>
        </SafeAreaView>
      );
  }
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
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webFallback: {
    ...typography.bodyMd,
    color: colors.greyInactive,
    textAlign: 'center',
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
