import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import type { MapMarkerItem, MapRecenterTarget } from '~/types/map/mapMarker';
import {
  regionForMarkers,
  regionToBounds,
  type LatLngBounds,
} from '~/utils/map/mapRecommendationData';
import { NativeMarker } from '~/components/map/common/NativeMarker';

type Props = {
  markers: MapMarkerItem[];
  selectedId: string | null;
  onMarkerPress: (id: string) => void;
  onRegionChangeComplete?: (bounds: LatLngBounds) => void;
  recenterTo?: MapRecenterTarget | null;
};

const MarkerMap: React.FC<Props> = ({
  markers,
  selectedId,
  onMarkerPress,
  onRegionChangeComplete,
  recenterTo,
}) => {
  const mapRef = useRef<MapView>(null);
  const initialRegion = useMemo(() => regionForMarkers(markers), [markers]);

  const handleRegionComplete = (region: Region) => {
    onRegionChangeComplete?.(regionToBounds(region));
  };

  useEffect(() => {
    if (!recenterTo) return;
    mapRef.current?.animateToRegion({
      latitude: recenterTo.latitude,
      longitude: recenterTo.longitude,
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    });
  }, [recenterTo]);

  return (
    <View className="min-h-0 w-full flex-1 overflow-hidden rounded-2xl border border-border bg-card">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionComplete}
        showsPointsOfInterest
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={Platform.OS === 'android'}
      >
        {markers.map((m) => (
          <NativeMarker
            key={m.id}
            marker={m}
            selected={selectedId === m.id}
            onPress={onMarkerPress}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MarkerMap;
