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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';

import { ThemePalette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import PickupMap, { MapRegion, PickupCoordinate } from '@/components/pickup-map';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

type AddressState = {
  fullName: string;
  mobile: string;
  pincode: string;
  flat: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  defaultAddress: boolean;
};

const defaultRegion: MapRegion = {
  latitude: 17.385,
  longitude: 78.4867,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function AddAddressScreen() {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const router = useRouter();
  const { t } = useTranslation();
  const [address, setAddress] = useState<AddressState>({
    fullName: '',
    mobile: '',
    pincode: '',
    flat: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    defaultAddress: true,
  });
  const [pickupOpen, setPickupOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<MapRegion>(defaultRegion);
  const [marker, setMarker] = useState<PickupCoordinate | null>({
    latitude: defaultRegion.latitude,
    longitude: defaultRegion.longitude,
  });
  const [locationStatus, setLocationStatus] = useState<string>('');

  const updateAddress = (key: keyof AddressState, value: string | boolean) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const applyReverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      const result = results[0];
      if (!result) return;
      const areaParts = [result.name, result.street, result.district]
        .filter(Boolean)
        .join(', ');

      setAddress((prev) => ({
        ...prev,
        pincode: result.postalCode ?? prev.pincode,
        city: result.city ?? result.subregion ?? prev.city,
        state: result.region ?? prev.state,
        area: areaParts || prev.area,
      }));
    } catch (error) {
      setLocationStatus('Unable to read this location.');
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLocationStatus('Fetching current location...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('Location permission denied.');
        return;
      }
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const nextRegion = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setRegion(nextRegion);
      setMarker({ latitude: current.coords.latitude, longitude: current.coords.longitude });
      await applyReverseGeocode(current.coords.latitude, current.coords.longitude);
      setLocationStatus('Current location applied.');
    } catch (error) {
      setLocationStatus('Unable to fetch current location.');
    }
  };

  const handleSearch = async () => {
    const query = search.trim();
    if (!query) return;
    try {
      setLocationStatus('Searching location...');
      const results = await Location.geocodeAsync(query);
      const first = results[0];
      if (!first) {
        setLocationStatus('No pickup locations found for this search.');
        return;
      }
      const nextRegion = {
        latitude: first.latitude,
        longitude: first.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setRegion(nextRegion);
      setMarker({ latitude: first.latitude, longitude: first.longitude });
      await applyReverseGeocode(first.latitude, first.longitude);
      setLocationStatus('Pickup location updated.');
    } catch (error) {
      setLocationStatus('Unable to search this location.');
    }
  };

  const handleUsePickupLocation = async () => {
    if (!marker) return;
    await applyReverseGeocode(marker.latitude, marker.longitude);
    setPickupOpen(false);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.breadcrumbRow}>
          <Pressable onPress={() => router.push('/(tabs)/account')}>
            <Text style={styles.breadcrumbMuted}>Your Account</Text>
          </Pressable>
          <Text style={styles.breadcrumbArrow}>{'>'}</Text>
          <Pressable onPress={() => router.push('/(tabs)/addresses')}>
            <Text style={styles.breadcrumbActive}>Your Addresses</Text>
          </Pressable>
          <Text style={styles.breadcrumbArrow}>{'>'}</Text>
          <Text style={styles.breadcrumbActive}>New Address</Text>
        </View>

        <Text style={styles.pageTitle}>{t('add_address_title')}</Text>

        <View style={styles.autoFillCard}>
          <View style={styles.autoFillRow}>
            <View style={styles.autoFillInfo}>
              <Text style={styles.autoFillTitle}>Save time. Autofill your current location.</Text>
              <Text style={styles.autoFillSubtitle}>
                We will use your device location to populate address fields.
              </Text>
            </View>
            <Pressable style={styles.autoFillButton} onPress={handleUseCurrentLocation}>
              <Text style={styles.autoFillButtonText}>Autofill</Text>
            </Pressable>
          </View>
          {locationStatus ? (
            <Text style={styles.locationStatus}>{locationStatus}</Text>
          ) : null}
        </View>

        <Pressable style={styles.pickupButton} onPress={() => setPickupOpen(true)}>
          <MaterialIcons name="place" size={18} color={palette.primary} />
          <Text style={styles.pickupButtonText}>{t('select_pickup_location')}</Text>
        </Pressable>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Country/Region</Text>
            <View style={styles.selectField}>
              <Text style={styles.selectText}>India</Text>
              <MaterialIcons name="keyboard-arrow-down" size={18} color={palette.text} />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={address.fullName}
              onChangeText={(value) => updateAddress('fullName', value)}
              placeholder="First and last name"
              placeholderTextColor={palette.mutedAlt}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mobile number</Text>
            <TextInput
              value={address.mobile}
              onChangeText={(value) => updateAddress('mobile', value)}
              placeholder="Enter mobile number"
              placeholderTextColor={palette.mutedAlt}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              value={address.pincode}
              onChangeText={(value) => updateAddress('pincode', value)}
              placeholder="6 digit PIN code"
              placeholderTextColor={palette.mutedAlt}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Flat, House no., Building, Company</Text>
            <TextInput
              value={address.flat}
              onChangeText={(value) => updateAddress('flat', value)}
              placeholder="Enter house or flat details"
              placeholderTextColor={palette.mutedAlt}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Area, Street, Sector, Village</Text>
            <TextInput
              value={address.area}
              onChangeText={(value) => updateAddress('area', value)}
              placeholder="Locality or street"
              placeholderTextColor={palette.mutedAlt}
              style={styles.input}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Landmark</Text>
            <TextInput
              value={address.landmark}
              onChangeText={(value) => updateAddress('landmark', value)}
              placeholder="E.g. near hospital"
              placeholderTextColor={palette.mutedAlt}
              style={styles.input}
            />
          </View>
          <View style={styles.inlineRow}>
            <View style={[styles.fieldGroup, styles.inlineField]}>
              <Text style={styles.label}>Town/City</Text>
              <TextInput
                value={address.city}
                onChangeText={(value) => updateAddress('city', value)}
                placeholder="City"
                placeholderTextColor={palette.mutedAlt}
                style={styles.input}
              />
            </View>
            <View style={[styles.fieldGroup, styles.inlineField]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                value={address.state}
                onChangeText={(value) => updateAddress('state', value)}
                placeholder="State"
                placeholderTextColor={palette.mutedAlt}
                style={styles.input}
              />
            </View>
          </View>
          <Pressable
            style={styles.checkboxRow}
            onPress={() => updateAddress('defaultAddress', !address.defaultAddress)}>
            <View style={[styles.checkbox, address.defaultAddress && styles.checkboxActive]}>
              {address.defaultAddress ? (
                <MaterialIcons name="check" size={14} color="#fff" />
              ) : null}
            </View>
            <Text style={styles.checkboxText}>Make this my default address</Text>
          </Pressable>
          <Pressable style={styles.submitButton}>
            <Text style={styles.submitButtonText}>{t('add_address_button')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={pickupOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a pickup location</Text>
              <Pressable onPress={() => setPickupOpen(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalSearchRow}>
              <Text style={styles.modalSearchLabel}>Find pickup locations near:</Text>
              <View style={styles.searchInputWrapper}>
                <MaterialIcons name="search" size={18} color={palette.mutedAlt} />
                <TextInput
                  placeholder="Enter an address, pin code, or landmark"
                  placeholderTextColor={palette.mutedAlt}
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                />
              </View>
              <Pressable style={styles.modalSearchButton} onPress={handleSearch}>
                <Text style={styles.modalSearchButtonText}>Search</Text>
              </Pressable>
            </View>

            {locationStatus ? (
              <View style={styles.statusBanner}>
                <MaterialIcons name="info" size={16} color={palette.primary} />
                <Text style={styles.statusText}>{locationStatus}</Text>
              </View>
            ) : null}

            <View style={styles.modalBody}>
              <View style={styles.listPane}>
                <Text style={styles.listTitle}>Nearby pickup locations</Text>
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>
                    Select a spot on the map or search to choose a pickup location.
                  </Text>
                </View>
                <Pressable style={styles.modalAction} onPress={handleUseCurrentLocation}>
                  <MaterialIcons name="my-location" size={16} color={palette.primary} />
                  <Text style={styles.modalActionText}>Use current location</Text>
                </Pressable>
              </View>
              <View style={styles.mapPane}>
                <PickupMap
                  region={region}
                  marker={marker}
                  onRegionChange={setRegion}
                  onPress={(coordinate) => {
                    setMarker(coordinate);
                    setLocationStatus('Pickup location selected.');
                  }}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={handleUsePickupLocation}>
                <Text style={styles.modalPrimaryText}>Use this pickup location</Text>
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
    breadcrumbRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    breadcrumbMuted: {
      color: palette.muted,
      fontSize: 12,
    },
    breadcrumbArrow: {
      color: palette.mutedAlt,
      fontSize: 12,
    },
    breadcrumbActive: {
      color: palette.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: palette.text,
    },
    autoFillCard: {
      backgroundColor: palette.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 10,
    },
    autoFillRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    autoFillInfo: {
      flex: 1,
      gap: 4,
    },
    autoFillTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.text,
    },
    autoFillSubtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    autoFillButton: {
      backgroundColor: palette.primary,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    autoFillButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 12,
    },
    locationStatus: {
      color: palette.muted,
      fontSize: 11,
    },
    pickupButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: palette.cardAlt,
    },
    pickupButtonText: {
      color: palette.primary,
      fontWeight: '600',
      fontSize: 13,
    },
    form: {
      gap: 14,
    },
    fieldGroup: {
      gap: 6,
    },
    label: {
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
    selectField: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: palette.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    selectText: {
      color: palette.text,
      fontSize: 14,
      fontWeight: '600',
    },
    inlineRow: {
      flexDirection: 'row',
      gap: 12,
    },
    inlineField: {
      flex: 1,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: palette.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.card,
    },
    checkboxActive: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    checkboxText: {
      fontSize: 12,
      color: palette.text,
      fontWeight: '600',
    },
    submitButton: {
      marginTop: 10,
      backgroundColor: palette.primary,
      borderRadius: 18,
      paddingVertical: 12,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 14,
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
    modalSearchRow: {
      padding: 16,
      gap: 10,
    },
    modalSearchLabel: {
      fontSize: 12,
      color: palette.muted,
      fontWeight: '600',
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      color: palette.text,
      fontSize: 13,
    },
    modalSearchButton: {
      alignSelf: 'flex-start',
      backgroundColor: palette.text,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    modalSearchButtonText: {
      color: palette.background,
      fontWeight: '600',
      fontSize: 12,
    },
    statusBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: palette.border,
      marginHorizontal: 16,
      padding: 10,
      borderRadius: 12,
      backgroundColor: palette.card,
    },
    statusText: {
      fontSize: 12,
      color: palette.text,
    },
    modalBody: {
      flexDirection: 'row',
      minHeight: 360,
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },
    listPane: {
      width: 260,
      padding: 16,
      gap: 12,
      borderRightWidth: 1,
      borderRightColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    listTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    emptyCard: {
      backgroundColor: palette.background,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: palette.border,
    },
    emptyText: {
      fontSize: 12,
      color: palette.muted,
      lineHeight: 16,
    },
    modalAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
    },
    modalActionText: {
      color: palette.primary,
      fontWeight: '600',
      fontSize: 12,
    },
    mapPane: {
      flex: 1,
      backgroundColor: palette.card,
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
