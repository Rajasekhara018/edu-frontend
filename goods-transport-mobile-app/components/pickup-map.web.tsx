import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

export type PickupCoordinate = { latitude: number; longitude: number };
export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type PickupMapProps = {
  region: MapRegion;
  marker: PickupCoordinate | null;
  onRegionChange: (region: MapRegion) => void;
  onPress: (coordinate: PickupCoordinate) => void;
  style?: ViewStyle;
};

export default function PickupMap({ style }: PickupMapProps) {
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.placeholderText}>
        Map preview is not available on web. Use search or current location to set
        pickup coordinates.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
