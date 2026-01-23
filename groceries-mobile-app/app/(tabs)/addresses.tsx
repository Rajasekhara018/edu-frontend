import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemePalette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  tag: string;
  isDefault?: boolean;
};

const addresses: Address[] = [
  {
    id: 'addr-1',
    name: 'Sai Durga Reddy',
    phone: '+91 98765 43210',
    line1: 'Flat 301, Lotus Residency',
    line2: 'Banjara Hills, Road No. 12',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    tag: 'Home',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Sai Durga Reddy',
    phone: '+91 98765 43210',
    line1: '12-4-221, Green Park',
    line2: 'Hi-tech City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    tag: 'Work',
  },
];

export default function AddressesScreen() {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={palette.text} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('addresses_title')}</Text>
            <Text style={styles.subtitle}>{t('addresses_subtitle')}</Text>
          </View>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/add-address')}>
            <Text style={styles.addButtonText}>{t('add_new_address')}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {addresses.map((addr) => (
            <View key={addr.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{addr.tag}</Text>
                </View>
                {addr.isDefault ? (
                  <Text style={styles.defaultBadge}>Default</Text>
                ) : null}
              </View>
              <Text style={styles.name}>{addr.name}</Text>
              <Text style={styles.text}>{addr.phone}</Text>
              <Text style={styles.text}>{addr.line1}</Text>
              <Text style={styles.text}>{addr.line2}</Text>
              <Text style={styles.text}>
                {addr.city}, {addr.state} {addr.pincode}
              </Text>
              <View style={styles.actionsRow}>
                <Pressable style={styles.actionButton}>
                  <Text style={styles.actionText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.actionButtonSecondary}>
                  <Text style={styles.actionText}>Remove</Text>
                </Pressable>
                <Pressable style={styles.actionButtonSecondary}>
                  <Text style={styles.actionText}>Set default</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: palette.background,
    },
    page: {
      padding: 18,
      gap: 16,
      paddingBottom: 120,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: palette.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
      gap: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.text,
    },
    subtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    addButton: {
      backgroundColor: palette.primary,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 12,
    },
    card: {
      gap: 14,
    },
    addressCard: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 4,
    },
    addressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    tagPill: {
      backgroundColor: palette.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 11,
      fontWeight: '700',
      color: palette.primary,
    },
    defaultBadge: {
      fontSize: 11,
      fontWeight: '700',
      color: palette.primary,
    },
    name: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.text,
    },
    text: {
      fontSize: 12,
      color: palette.muted,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
      flexWrap: 'wrap',
    },
    actionButton: {
      backgroundColor: palette.primary,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    actionButtonSecondary: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    actionText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
  });
