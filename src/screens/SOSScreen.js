import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function SOSScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.emergencyCircle}>
          <MaterialIcons name="emergency" size={80} color={colors.white} />
        </View>
        <Text style={styles.title}>EMERGENCY SOS</Text>
        <Text style={styles.subtitle}>Help is being dispatched to your location.</Text>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: spacing.marginMobile,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
  },
  emergencyCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.sosRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.sosRed,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurface,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  cancelButton: {
    marginTop: spacing.lg * 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.outline,
  },
  cancelText: {
    ...typography.callout,
    color: colors.onSurfaceVariant,
  },
});
