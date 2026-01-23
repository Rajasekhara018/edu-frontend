import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { ThemePalette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const userProfile = {
  name: 'Sai Durga Reddy',
  email: 'saired..@mail.com',
  phone: '+91 98765 43210',
  memberSince: 'Member since 2023',
  avatar: 'https://i.pravatar.cc/160?img=32',
};

export default function AccountScreen() {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const router = useRouter();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(userProfile);
  const [showEdit, setShowEdit] = useState(false);
  const [draft, setDraft] = useState(userProfile);
  const [imageNote, setImageNote] = useState('');

  const handlePickAvatar = async () => {
    try {
      setImageNote('');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setImageNote('Permission required to access photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled || result.assets.length === 0) return;

      const asset = result.assets[0];
      const size = Math.min(asset.width ?? 0, asset.height ?? 0);
      if (!asset.uri || !asset.width || !asset.height || !size) {
        setImageNote('Unable to crop this image.');
        return;
      }

      const crop = {
        originX: Math.floor((asset.width - size) / 2),
        originY: Math.floor((asset.height - size) / 2),
        width: size,
        height: size,
      };

      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ crop }, { resize: { width: 256, height: 256 } }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      setDraft({ ...draft, avatar: manipulated.uri });
      setImageNote('Photo updated. Save changes to apply.');
    } catch (error) {
      setImageNote('Unable to update photo.');
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={palette.text} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('your_account_title')}</Text>
            <Text style={styles.subtitle}>{t('your_account_subtitle')}</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileMeta}>{profile.email}</Text>
            <Text style={styles.profileMeta}>{profile.phone}</Text>
            <Text style={styles.profileTag}>{profile.memberSince}</Text>
          </View>
          <Pressable
            style={styles.editButton}
            onPress={() => {
              setDraft(profile);
              setImageNote('');
              setShowEdit(true);
            }}>
            <Text style={styles.editButtonText}>{t('edit')}</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Orders', value: '12', route: '/(tabs)/orders' },
            { label: 'Addresses', value: '2', route: '/(tabs)/addresses' },
            { label: 'Refunds', value: '3', route: '/(tabs)/payments-refunds' },
          ].map((stat) => (
            <Pressable
              key={stat.label}
              style={styles.statCard}
              onPress={() => router.push(stat.route)}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('quick_actions')}</Text>
          {[
            { icon: 'receipt-long', label: 'Your orders', route: '/(tabs)/orders' },
            { icon: 'location-on', label: 'Manage addresses', route: '/(tabs)/addresses' },
            { icon: 'payments', label: 'Payments & refunds', route: '/(tabs)/payments-refunds' },
            { icon: 'support-agent', label: 'Help & support', route: '/(tabs)/help-support' },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={styles.actionRow}
              onPress={() => router.push(item.route)}>
              <View style={styles.actionIcon}>
                <MaterialIcons
                  name={item.icon as keyof typeof MaterialIcons.glyphMap}
                  size={18}
                  color={palette.primary}
                />
              </View>
              <Text style={styles.actionText}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={20} color={palette.mutedAlt} />
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('preferences')}</Text>
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Default delivery address</Text>
            <Text style={styles.preferenceValue}>Banjara Hills</Text>
          </View>
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Notifications</Text>
            <Text style={styles.preferenceValue}>Enabled</Text>
          </View>
          <Pressable style={styles.inlineButton} onPress={() => router.push('/(tabs)/settings')}>
            <Text style={styles.inlineButtonText}>{t('open_settings')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={showEdit} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit profile</Text>
              <Pressable onPress={() => setShowEdit(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <Pressable style={styles.photoRow} onPress={handlePickAvatar}>
                <Image source={{ uri: draft.avatar }} style={styles.photoPreview} />
                <View style={styles.photoInfo}>
                  <Text style={styles.photoTitle}>Change profile photo</Text>
                  <Text style={styles.photoSubtitle}>Square crop will be applied</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={palette.mutedAlt} />
              </Pressable>
              {imageNote ? <Text style={styles.imageNote}>{imageNote}</Text> : null}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full name</Text>
                <TextInput
                  value={draft.name}
                  onChangeText={(value) => setDraft({ ...draft, name: value })}
                  placeholder="Full name"
                  placeholderTextColor={palette.mutedAlt}
                  style={styles.input}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  value={draft.email}
                  onChangeText={(value) => setDraft({ ...draft, email: value })}
                  placeholder="Email address"
                  placeholderTextColor={palette.mutedAlt}
                  style={styles.input}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Phone number</Text>
                <TextInput
                  value={draft.phone}
                  onChangeText={(value) => setDraft({ ...draft, phone: value })}
                  placeholder="Phone number"
                  placeholderTextColor={palette.mutedAlt}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Profile image URL</Text>
                <TextInput
                  value={draft.avatar}
                  onChangeText={(value) => setDraft({ ...draft, avatar: value })}
                  placeholder="https://..."
                  placeholderTextColor={palette.mutedAlt}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Pressable
                style={styles.modalPrimary}
                onPress={() => {
                  setProfile(draft);
                  setShowEdit(false);
                }}>
                <Text style={styles.modalPrimaryText}>Save changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    profileCard: {
      backgroundColor: palette.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      flexDirection: 'row',
      gap: 14,
      alignItems: 'center',
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 24,
      backgroundColor: palette.cardAlt,
    },
    profileInfo: {
      flex: 1,
      gap: 4,
    },
    profileName: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    profileMeta: {
      fontSize: 12,
      color: palette.muted,
    },
    profileTag: {
      fontSize: 11,
      color: palette.primary,
      fontWeight: '600',
    },
    editButton: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: palette.cardAlt,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      alignItems: 'center',
      gap: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.text,
    },
    statLabel: {
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
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 6,
    },
    actionIcon: {
      width: 32,
      height: 32,
      borderRadius: 12,
      backgroundColor: palette.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600',
      color: palette.text,
    },
    preferenceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    preferenceLabel: {
      fontSize: 12,
      color: palette.muted,
    },
    preferenceValue: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    inlineButton: {
      alignSelf: 'flex-start',
      marginTop: 6,
    },
    inlineButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.primary,
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
    modalFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    photoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    photoPreview: {
      width: 56,
      height: 56,
      borderRadius: 20,
      backgroundColor: palette.card,
    },
    photoInfo: {
      flex: 1,
      gap: 2,
    },
    photoTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    photoSubtitle: {
      fontSize: 11,
      color: palette.muted,
    },
    imageNote: {
      fontSize: 11,
      color: palette.muted,
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
    fieldGroup: {
      gap: 6,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.muted,
    },
    input: {
      backgroundColor: palette.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: palette.text,
    },
  });
