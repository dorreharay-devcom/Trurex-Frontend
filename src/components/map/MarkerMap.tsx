import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import { Minus, Plus } from 'lucide-react-native';
import type { MapMarkerItem, MapRecenterTarget } from '~/types/map/mapMarker';
import {
  regionForMarkers,
  regionToBounds,
  type LatLngBounds,
} from '~/utils/map/mapRecommendationData';
import { NativeMarker } from '~/components/map/common/NativeMarker';
import { MAP_ACTION_INSET, MAP_ZOOM_CONTROLS_BOTTOM } from '~/constants/map/mapUi';
import { Theme } from '~/theme/Theme';

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
  const regionRef = useRef<Region>(initialRegion);
  const markersRef = useRef(markers);
  markersRef.current = markers;

  const handleRegionComplete = useCallback(
    (region: Region) => {
      regionRef.current = region;
      onRegionChangeComplete?.(regionToBounds(region));
    },
    [onRegionChangeComplete],
  );

  useEffect(() => {
    regionRef.current = initialRegion;
  }, [initialRegion]);

  useEffect(() => {
    if (!recenterTo) return;
    if (recenterTo.fitMarkers) {
      const m = markersRef.current;
      if (m.length > 0) mapRef.current?.animateToRegion(regionForMarkers(m));
      return;
    }
    mapRef.current?.animateToRegion({
      latitude: recenterTo.latitude,
      longitude: recenterTo.longitude,
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    });
  }, [recenterTo]);

  const zoomByFactor = useCallback((factor: number) => {
    const r = regionRef.current;
    mapRef.current?.animateToRegion({
      ...r,
      latitudeDelta: Math.min(180, Math.max(0.001, r.latitudeDelta * factor)),
      longitudeDelta: Math.min(360, Math.max(0.001, r.longitudeDelta * factor)),
    });
  }, []);

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

      <View
        pointerEvents="box-none"
        className="absolute z-[1150] flex-col gap-1.5"
        style={{
          right: MAP_ACTION_INSET,
          bottom: MAP_ZOOM_CONTROLS_BOTTOM,
          elevation: Platform.OS === 'android' ? 14 : 0,
        }}
      >
        <Pressable
          onPress={() => zoomByFactor(0.65)}
          className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-md active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Zoom in"
        >
          <Plus size={18} color={Theme.colors.foreground} />
        </Pressable>
        <Pressable
          onPress={() => zoomByFactor(1.55)}
          className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-md active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Zoom out"
        >
          <Minus size={18} color={Theme.colors.foreground} />
        </Pressable>
      </View>
    </View>
  );
};

export default MarkerMap;
