import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/services/supabaseClient';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';
import { shadows } from '@/src/theme/shadows';

export default function SOSScreen() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [active, setActive] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let timer;
    if (active && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (active && countdown === 0) {
      sendSOS();
    }
    return () => clearInterval(timer);
  }, [active, countdown]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const triggerSOS = () => {
    setActive(true);
    setCountdown(5);
  };

  const cancelSOS = () => {
    setActive(false);
    setCountdown(5);
  };

  const sendSOS = async () => {
    setSending(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let locationMsg = 'Location not available';
      let coords = { latitude: 0, longitude: 0 };

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
        locationMsg = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
      }

      // Log to Supabase
      try {
        await (supabase as any).from('sos_logs').insert([
          { user_latitude: coords.latitude, user_longitude: coords.longitude }
        ]);
      } catch (e) {
          console.error(e);
      }

      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(
          ['999', '994'],
          `EMERGENCY SOS from ZimPulse! I need immediate assistance. My location: ${locationMsg}`
        );
        Alert.alert('Success', 'SOS alert sent to emergency services and guardians.');
      } else {
        Alert.alert('Emergency', 'SMS services unavailable. Please call 999 directly.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send SOS alert.');
    } finally {
      setSending(false);
      setActive(false);
      setCountdown(5);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.darkHeader }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>EMERGENCY DASHBOARD</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!active ? (
          <View style={styles.mainAction}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                    style={styles.sosButton}
                    onPress={triggerSOS}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="emergency" size={100} color={colors.white} />
                    <Text style={styles.sosText}>ACTIVATE SOS</Text>
                </TouchableOpacity>
            </Animated.View>
            <Text style={styles.hint}>Press to trigger immediate response</Text>
          </View>
        ) : (
          <View style={styles.activeContainer}>
            <Text style={styles.countdownTitle}>Emergency dispatching in</Text>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownNumber}>{countdown}</Text>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelSOS}
            >
              <Text style={styles.cancelText}>CANCEL ALERT</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.dashboardGrid}>
            <View style={styles.gridItem}>
                <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                    <FontAwesome5 name="ambulance" size={24} color={colors.primary} />
                </View>
                <Text style={styles.gridLabel}>Ambulance</Text>
                <Text style={styles.gridValue}>999</Text>
            </View>

            <View style={styles.gridItem}>
                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                    <MaterialIcons name="local-police" size={24} color={colors.secondary} />
                </View>
                <Text style={styles.gridLabel}>Police</Text>
                <Text style={styles.gridValue}>995</Text>
            </View>

            <View style={styles.gridItem}>
                <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                    <MaterialIcons name="fire-truck" size={24} color={colors.tertiary} />
                </View>
                <Text style={styles.gridLabel}>Fire Brigade</Text>
                <Text style={styles.gridValue}>993</Text>
            </View>

            <View style={styles.gridItem}>
                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                    <MaterialIcons name="people" size={24} color={colors.successGreen} />
                </View>
                <Text style={styles.gridLabel}>Guardians</Text>
                <Text style={styles.gridValue}>Active</Text>
            </View>
        </View>

        <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/guardians' as any)}
        >
            <MaterialIcons name="security" size={24} color={colors.onSurface} />
            <View style={{ flex: 1 }}>
                <Text style={styles.actionRowTitle}>Manage Emergency Contacts</Text>
                <Text style={styles.actionRowSubtitle}>Add or remove guardians</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.greyInactive} />
        </TouchableOpacity>

        <View style={styles.infoBox}>
            <MaterialIcons name="info" size={20} color={colors.onSecondaryFixed} />
            <Text style={styles.infoText}>
                Your precise location will be shared with verified emergency responders and your chosen guardians.
            </Text>
        </View>
      </ScrollView>

      {sending && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.overlayText}>Dispatching Help...</Text>
        </View>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    letterSpacing: 2,
    color: colors.white,
  },
  scrollContent: {
    padding: spacing.marginMobile,
    alignItems: 'center',
  },
  mainAction: {
      alignItems: 'center',
      marginVertical: 40,
  },
  sosButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sosGlow,
    marginBottom: spacing.lg,
  },
  sosText: {
    ...typography.h3,
    color: colors.white,
    marginTop: spacing.sm,
    fontWeight: '900',
  },
  hint: {
    ...typography.bodyMd,
    color: colors.greyInactive,
    textAlign: 'center',
  },
  activeContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  countdownTitle: {
    ...typography.h3,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  countdownCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  countdownNumber: {
    ...typography.h1,
    fontSize: 64,
    color: colors.primary,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg * 2,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHighest,
  },
  cancelText: {
    ...typography.callout,
    color: colors.primary,
    fontWeight: '800',
  },
  dashboardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginVertical: 24,
      width: '100%',
  },
  gridItem: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.white,
      padding: 16,
      borderRadius: 16,
      ...shadows.card,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      alignItems: 'center',
  },
  iconBox: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
  },
  gridLabel: {
      fontSize: 12,
      color: colors.greyInactive,
      fontWeight: '600',
  },
  gridValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.onSurface,
  },
  actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      width: '100%',
      padding: 16,
      borderRadius: 12,
      gap: 16,
      ...shadows.card,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      marginBottom: 24,
  },
  actionRowTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.onSurface,
  },
  actionRowSubtitle: {
      fontSize: 12,
      color: colors.greyInactive,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryFixed,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    alignItems: 'center',
    width: '100%',
  },
  infoText: {
    flex: 1,
    ...typography.bodySm,
    color: colors.onSecondaryFixed,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayText: {
    ...typography.h3,
    color: colors.white,
    marginTop: spacing.md,
  },
});
