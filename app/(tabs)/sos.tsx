import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';
import { shadows } from '@/src/theme/shadows';

export default function SOSScreen() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [active, setActive] = useState(false);

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

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        locationMsg = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
      }

      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
          ['911', '0770000000'], // Emergency contacts
          `EMERGENCY SOS from ZimPulse! I need immediate assistance. My location: ${locationMsg}`
        );
        if (result === 'sent') {
          Alert.alert('Success', 'SOS alert sent to emergency contacts.');
        }
      } else {
        Alert.alert('Error', 'SMS services are not available on this device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send SOS alert.');
      console.error(error);
    } finally {
      setSending(false);
      setActive(false);
      setCountdown(5);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency SOS</Text>
      </View>

      <View style={styles.content}>
        {!active ? (
          <>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={triggerSOS}
              activeOpacity={0.8}
            >
              <MaterialIcons name="emergency" size={100} color={colors.white} />
              <Text style={styles.sosText}>HOLD TO ALERT</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>Press the button to trigger emergency response</Text>
          </>
        ) : (
          <View style={styles.activeContainer}>
            <Text style={styles.countdownTitle}>Sending Alert in</Text>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownNumber}>{countdown}</Text>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelSOS}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        )}

        {sending && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.overlayText}>Sending SOS...</Text>
          </View>
        )}
      </View>

      <View style={styles.infoBox}>
          <MaterialIcons name="info" size={20} color={colors.secondary} />
          <Text style={styles.infoText}>
            Triggering SOS will send your live location to emergency services and your primary contacts.
          </Text>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
  },
  sosButton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sosGlow,
    marginBottom: spacing.lg,
  },
  sosText: {
    ...typography.h2,
    color: colors.white,
    marginTop: spacing.sm,
  },
  hint: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  activeContainer: {
    alignItems: 'center',
  },
  countdownTitle: {
    ...typography.h2,
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
    color: colors.onSurface,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    ...typography.h3,
    color: colors.white,
    marginTop: spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryFixed,
    margin: spacing.marginMobile,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    ...typography.bodySm,
    color: colors.onSecondaryFixed,
  }
});
