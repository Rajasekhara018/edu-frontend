import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

export type PickupCoordinate = { latitude: number; longitude: number };
export type MapRegion = Region;

type PickupMapProps = {
  region: MapRegion;
  marker: PickupCoordinate | null;
  onRegionChange: (region: MapRegion) => void;
  onPress: (coordinate: PickupCoordinate) => void;
  style?: ViewStyle;
};

export default function PickupMap({
  region,
  marker,
  onRegionChange,
  onPress,
  style,
}: PickupMapProps) {
  return (
    <MapView
      style={[styles.map, style]}
      region={region}
      onRegionChangeComplete={onRegionChange}
      onPress={(event) => onPress(event.nativeEvent.coordinate)}>
      {marker ? <Marker coordinate={marker} /> : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
