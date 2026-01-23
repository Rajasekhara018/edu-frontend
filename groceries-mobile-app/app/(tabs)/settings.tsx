import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemeLabels, ThemeName, ThemePresets } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const themeOrder: ThemeName[] = [
  'system',
  'light',
  'dark',
  'ocean',
  'sunset',
  'sand',
];

export default function SettingsScreen() {
  const { palette, theme, setTheme, resolvedTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offersEnabled, setOffersEnabled] = useState(false);

  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Theme: {ThemeLabels[theme]} ({ThemeLabels[resolvedTheme]})
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appearance</Text>
          <Text style={styles.cardSubtitle}>Switch themes instantly.</Text>

          <View style={styles.themeGrid}>
            {themeOrder.map((key) => {
              const preview =
                key === 'system' ? ThemePresets[resolvedTheme] : ThemePresets[key];
              const active = theme === key;
              return (
                <Pressable
                  key={key}
                  style={[styles.themeChip, active && styles.themeChipActive]}
                  onPress={() => setTheme(key)}>
                  <View
                    style={[
                      styles.themePreview,
                      { backgroundColor: preview.background },
                    ]}>
                    <View
                      style={[
                        styles.themePreviewDot,
                        { backgroundColor: preview.primary },
                      ]}
                    />
                    <View
                      style={[
                        styles.themePreviewBar,
                        { backgroundColor: preview.card },
                      ]}
                    />
                  </View>
                  <Text style={styles.themeChipText}>{ThemeLabels[key]}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Push notifications</Text>
              <Text style={styles.settingSubtitle}>
                Order updates and delivery alerts.
              </Text>
            </View>
            <Pressable
              style={[
                styles.toggle,
                notificationsEnabled && styles.toggleActive,
              ]}
              onPress={() => setNotificationsEnabled((prev) => !prev)}>
              <View
                style={[
                  styles.toggleThumb,
                  notificationsEnabled && styles.toggleThumbActive,
                ]}
              />
            </Pressable>
          </View>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Offers & deals</Text>
              <Text style={styles.settingSubtitle}>
                Weekly savings and personalized offers.
              </Text>
            </View>
            <Pressable
              style={[styles.toggle, offersEnabled && styles.toggleActive]}
              onPress={() => setOffersEnabled((prev) => !prev)}>
              <View
                style={[
                  styles.toggleThumb,
                  offersEnabled && styles.toggleThumbActive,
                ]}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          {[
            { icon: 'receipt-long', label: 'Orders' },
            { icon: 'location-on', label: 'Saved addresses' },
            { icon: 'payments', label: 'Payments & refunds' },
            { icon: 'support-agent', label: 'Help & support' },
          ].map((item) => (
            <Pressable key={item.label} style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <MaterialIcons
                    name={item.icon as keyof typeof MaterialIcons.glyphMap}
                    size={18}
                    color={palette.primary}
                  />
                </View>
                <Text style={styles.optionText}>{item.label}</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={palette.mutedAlt}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (palette: typeof ThemePresets.light) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: palette.background,
    },
    content: {
      padding: 18,
      gap: 16,
      paddingBottom: 120,
    },
    header: {
      gap: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: palette.text,
    },
    subtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    card: {
      backgroundColor: palette.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 12,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: palette.text,
    },
    cardSubtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    themeChip: {
      width: '47%',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 10,
      gap: 8,
      backgroundColor: palette.cardAlt,
    },
    themeChipActive: {
      borderColor: palette.primary,
    },
    themeChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    themePreview: {
      borderRadius: 12,
      height: 46,
      padding: 8,
      borderWidth: 1,
      borderColor: palette.border,
      justifyContent: 'space-between',
    },
    themePreviewDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    themePreviewBar: {
      height: 10,
      borderRadius: 6,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: palette.text,
    },
    settingSubtitle: {
      fontSize: 12,
      color: palette.muted,
      marginTop: 2,
    },
    toggle: {
      width: 44,
      height: 26,
      borderRadius: 20,
      backgroundColor: palette.cardAlt,
      padding: 3,
      justifyContent: 'center',
    },
    toggleActive: {
      backgroundColor: palette.primarySoft,
    },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: palette.mutedAlt,
    },
    toggleThumbActive: {
      backgroundColor: palette.primary,
      alignSelf: 'flex-end',
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    optionIcon: {
      width: 32,
      height: 32,
      borderRadius: 12,
      backgroundColor: palette.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionText: {
      fontSize: 13,
      fontWeight: '600',
      color: palette.text,
    },
  });
