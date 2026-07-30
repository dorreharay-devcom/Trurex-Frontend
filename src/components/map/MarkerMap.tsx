import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Pressable, type LayoutChangeEvent } from 'react-native';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { Minus, Plus } from 'lucide-react-native';
import type { MapMarkerItem, MapRecenterTarget } from '~/types/map/mapMarker';
import {
  regionForMarkers,
  regionToBounds,
  type LatLngBounds,
} from '~/utils/map/mapRecommendationData';
import { NativeMarker } from '~/components/map/common/NativeMarker';
import { MAP_ACTION_INSET, MAP_ZOOM_CONTROLS_BOTTOM } from '~/constants/map/mapUi';
import { Theme } from '~/shared/theme/Theme';

const ANDROID_TILE_LOAD_TIMEOUT_MS = 2500;

type Props = {
  markers: MapMarkerItem[];
  selectedId: string | null;
  onMarkerPress: (id: string) => void;
  initialRegion?: Region;
  onRegionChangeComplete?: (bounds: LatLngBounds, region: Region) => void;
  recenterTo?: MapRecenterTarget | null;
};

const MarkerMap: React.FC<Props> = ({
  markers,
  selectedId,
  onMarkerPress,
  initialRegion: initialRegionProp,
  onRegionChangeComplete,
  recenterTo,
}) => {
  const mapRef = useRef<MapView>(null);
  const androidTileRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const androidTileRetryCountRef = useRef(0);
  const markersInitialRegion = useMemo(() => regionForMarkers(markers), [markers]);
  const initialRegion = initialRegionProp ?? markersInitialRegion;
  const regionRef = useRef<Region>(initialRegion);
  const markersRef = useRef(markers);
  markersRef.current = markers;
  const iosSelectedMarker = useMemo(() => {
    if (Platform.OS !== 'ios' || !selectedId) return null;
    return markers.find((marker) => marker.id === selectedId) ?? null;
  }, [markers, selectedId]);
  const [mapLayoutReady, setMapLayoutReady] = useState(Platform.OS !== 'android');
  const [androidMapKey, setAndroidMapKey] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  const clearAndroidTileRetry = useCallback(() => {
    if (androidTileRetryRef.current == null) return;
    clearTimeout(androidTileRetryRef.current);
    androidTileRetryRef.current = null;
  }, []);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    if (Platform.OS !== 'android') return;
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) setMapLayoutReady(true);
  }, []);

  const handleRegionComplete = useCallback(
    (region: Region) => {
      regionRef.current = region;
      onRegionChangeComplete?.(regionToBounds(region), region);
    },
    [onRegionChangeComplete],
  );

  useEffect(() => {
    regionRef.current = initialRegion;
  }, [initialRegion]);

  useEffect(() => clearAndroidTileRetry, [clearAndroidTileRetry]);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
    if (Platform.OS !== 'android') return;
    clearAndroidTileRetry();
    if (androidTileRetryCountRef.current > 0) return;
    androidTileRetryRef.current = setTimeout(() => {
      androidTileRetryCountRef.current += 1;
      setAndroidMapKey((key) => key + 1);
    }, ANDROID_TILE_LOAD_TIMEOUT_MS);
  }, [clearAndroidTileRetry]);

  const handleMapLoaded = useCallback(() => {
    if (Platform.OS !== 'android') return;
    androidTileRetryCountRef.current = 0;
    clearAndroidTileRetry();
  }, [clearAndroidTileRetry]);

  useEffect(() => {
    if (!mapReady) return;
    if (!recenterTo) return;
    if (recenterTo.fitMarkers) {
      const m = markersRef.current;
      if (m.length > 0) {
        mapRef.current?.fitToCoordinates(
          m.map((marker) => ({ latitude: marker.latitude, longitude: marker.longitude })),
          {
            edgePadding: { top: 80, right: 80, bottom: 120, left: 80 },
            animated: true,
          },
        );
      }
      return;
    }
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: recenterTo.latitude,
          longitude: recenterTo.longitude,
        },
        zoom: 14,
      },
      { duration: 450 },
    );
  }, [mapReady, recenterTo]);

  const zoomByFactor = useCallback((factor: number) => {
    const r = regionRef.current;
    mapRef.current?.animateToRegion({
      ...r,
      latitudeDelta: Math.min(180, Math.max(0.001, r.latitudeDelta * factor)),
      longitudeDelta: Math.min(360, Math.max(0.001, r.longitudeDelta * factor)),
    });
  }, []);

  return (
    <View
      className="min-h-0 w-full flex-1 overflow-hidden rounded-2xl border border-border bg-card"
      onLayout={handleContainerLayout}
    >
      {mapLayoutReady ? (
        <MapView
          key={Platform.OS === 'android' ? `android-map-${androidMapKey}` : 'map'}
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          onMapReady={handleMapReady}
          onMapLoaded={handleMapLoaded}
          onRegionChangeComplete={handleRegionComplete}
          loadingEnabled={Platform.OS === 'android'}
          loadingBackgroundColor={Theme.colors.card}
          loadingIndicatorColor={Theme.colors.primary}
          showsPointsOfInterest
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={Platform.OS === 'android'}
        >
          {markers.map((m) => (
            <NativeMarker
              key={Platform.OS === 'android' ? `${androidMapKey}-${m.id}` : m.id}
              marker={m}
              active={Platform.OS === 'ios' ? false : selectedId === m.id}
              onPress={onMarkerPress}
            />
          ))}
          {iosSelectedMarker ? (
            <NativeMarker
              key={`ios-selected-${iosSelectedMarker.id}`}
              marker={iosSelectedMarker}
              active
              onPress={onMarkerPress}
            />
          ) : null}
        </MapView>
      ) : null}

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
