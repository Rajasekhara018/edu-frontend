import React, { useMemo, useState } from 'react';
import {
  Modal,
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

import { ThemeLabels, ThemeName, ThemePresets } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { getLanguageLabel, setLanguage } from '@/i18n';
import { languageOptions } from '@/i18n/languages';

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
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offersEnabled, setOffersEnabled] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings_title')}</Text>
          <Text style={styles.subtitle}>
            {t('settings_subtitle', {
              theme: ThemeLabels[theme],
              resolved: ThemeLabels[resolvedTheme],
            })}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('appearance_title')}</Text>
          <Text style={styles.cardSubtitle}>{t('appearance_subtitle')}</Text>

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
          <Text style={styles.cardTitle}>{t('preferences_title')}</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>{t('notifications_title')}</Text>
              <Text style={styles.settingSubtitle}>{t('notifications_subtitle')}</Text>
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
              <Text style={styles.settingTitle}>{t('offers_title')}</Text>
              <Text style={styles.settingSubtitle}>{t('offers_subtitle')}</Text>
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
          <Text style={styles.cardTitle}>{t('account_title')}</Text>
          {[
            { icon: 'person', label: t('your_account') },
            { icon: 'receipt-long', label: t('orders') },
            { icon: 'location-on', label: t('your_addresses') },
            { icon: 'payments', label: t('payments_refunds') },
            { icon: 'support-agent', label: t('help_support') },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={styles.optionRow}
              onPress={() => {
                if (item.label === t('your_account')) {
                  router.push('/(tabs)/account');
                }
                if (item.label === t('orders')) {
                  router.push('/(tabs)/orders');
                }
                if (item.label === t('your_addresses')) {
                  router.push('/(tabs)/addresses');
                }
                if (item.label === t('payments_refunds')) {
                  router.push('/(tabs)/payments-refunds');
                }
                if (item.label === t('help_support')) {
                  router.push('/(tabs)/help-support');
                }
              }}>
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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('language_region_title')}</Text>
          <Text style={styles.cardSubtitle}>{t('language_subtitle')}</Text>
          <Pressable
            style={styles.optionRow}
            onPress={() => setShowLanguageModal(true)}>
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <MaterialIcons name="language" size={18} color={palette.primary} />
              </View>
              <Text style={styles.optionText}>{t('language_button')}</Text>
            </View>
            <Text style={styles.languageValue}>
              {getLanguageLabel(i18n.language)}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={showLanguageModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('language_select')}</Text>
              <Pressable onPress={() => setShowLanguageModal(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {languageOptions.map((lang) => (
                <Pressable
                  key={lang.code}
                  style={styles.languageRow}
                  onPress={async () => {
                    await setLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}>
                  <Text style={styles.languageLabel}>{lang.nativeLabel}</Text>
                  <Text style={styles.languageSubLabel}>{lang.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowLanguageModal(false)}>
                <Text style={styles.modalPrimaryText}>{t('language_done')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    languageValue: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.muted,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 18, 16, 0.45)',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      backgroundColor: palette.background,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: 'hidden',
      maxHeight: '85%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: palette.cardAlt,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    modalContent: {
      padding: 16,
      gap: 12,
    },
    languageRow: {
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.cardAlt,
      gap: 2,
    },
    languageLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    languageSubLabel: {
      fontSize: 11,
      color: palette.muted,
    },
    modalFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    modalPrimary: {
      backgroundColor: palette.primary,
      borderRadius: 18,
      paddingVertical: 12,
      alignItems: 'center',
    },
    modalPrimaryText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
    },
  });
