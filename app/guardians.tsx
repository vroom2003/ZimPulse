import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/services/supabaseClient';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';
import { shadows } from '@/src/theme/shadows';

interface Guardian {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export default function GuardiansScreen() {
  const router = useRouter();
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchGuardians();
  }, []);

  async function fetchGuardians() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('guardians').select('*');
      if (data) setGuardians(data);
      if (error) console.error('Error fetching guardians:', error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addGuardian() {
    if (!name || !phone) {
      Alert.alert('Error', 'Please fill in name and phone');
      return;
    }

    setAdding(true);
    try {
      const { data, error } = await supabase.from('guardians').insert([
        { name, phone }
      ]).select();

      if (error) throw error;

      if (data) {
        setGuardians([...guardians, data[0]]);
        setName('');
        setPhone('');
        Alert.alert('Success', 'Guardian added successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add guardian');
      console.error(error);
    } finally {
      setAdding(false);
    }
  }

  const renderItem = ({ item }: { item: Guardian }) => (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <MaterialIcons name="person" size={24} color={colors.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.guardianName}>{item.name}</Text>
        <Text style={styles.guardianInfo}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        onPress={() => Alert.alert('Delete', 'Would you like to remove this guardian?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {} }
        ])}
      >
        <MaterialIcons name="delete-outline" size={24} color={colors.greyInactive} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.darkHeader }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MANAGE GUARDIANS</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <MaterialIcons name="security" size={24} color={colors.secondary} />
          <Text style={styles.infoText}>
            Guardians are notified instantly when you trigger an SOS alert.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add New Guardian</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addGuardian}
            disabled={adding}
          >
            {adding ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.addButtonText}>Add Guardian</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your Guardians</Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : guardians.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="people-outline" size={64} color={colors.greyInactive} />
            <Text style={styles.emptyText}>No guardians added yet</Text>
          </View>
        ) : (
          guardians.map(g => renderItem({ item: g }))
        )}
      </ScrollView>
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
  scrollContent: {
    padding: spacing.marginMobile,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryFixed,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    ...typography.bodySm,
    color: colors.onSecondaryFixed,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    ...shadows.card,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  formTitle: {
    ...typography.h3,
    marginBottom: 16,
    color: colors.onSurface,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  guardianName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  guardianInfo: {
    fontSize: 14,
    color: colors.greyInactive,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.greyInactive,
  }
});
