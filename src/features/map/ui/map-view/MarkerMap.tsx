import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { useAndroidMapRemount } from '~/features/map/hooks/platform/useAndroidMapRemount';
import { useNativeMapRecenter } from '~/features/map/hooks/platform/useNativeMapRecenter';
import { regionForMarkers, regionToBounds } from '~/features/map/lib/geo';
import type { MarkerMapProps } from '~/features/map/types/markerMap';
import MapZoomControls from '~/features/map/ui/map-view/MapZoomControls';
import NativeMarker from '~/features/map/ui/map-view/NativeMarker';
import { Theme } from '~/shared/theme/Theme';
import { isAndroid, isIos } from '~/shared/lib/ui/platform';

const ZOOM_IN_FACTOR = 0.65;
const ZOOM_OUT_FACTOR = 1.55;

function nativeMapProvider() {
  if (isAndroid) return PROVIDER_GOOGLE;
  return undefined;
}

const NATIVE_MAP_PROVIDER = nativeMapProvider();

const MarkerMap = ({
  markers,
  selectedId,
  onMarkerPress,
  initialRegion: initialRegionProp,
  onRegionChangeComplete,
  recenterTo,
}: MarkerMapProps) => {
  const mapRef = useRef<MapView>(null);
  const markersInitialRegion = useMemo(() => regionForMarkers(markers), [markers]);
  const initialRegion = initialRegionProp ?? markersInitialRegion;
  const regionRef = useRef<Region>(initialRegion);
  const [mapReady, setMapReady] = useState(false);
  const {
    mapLayoutReady,
    androidMapKey,
    handleContainerLayout,
    handleMapReady: handleAndroidMapReady,
    handleMapLoaded,
  } = useAndroidMapRemount();

  const iosSelectedMarker = useMemo(() => {
    if (!isIos || !selectedId) return null;
    return markers.find((marker) => marker.id === selectedId) ?? null;
  }, [markers, selectedId]);

  useEffect(() => {
    regionRef.current = initialRegion;
  }, [initialRegion]);

  useNativeMapRecenter({ mapRef, mapReady, recenterTo, markers });

  const handleRegionComplete = useCallback(
    (region: Region) => {
      regionRef.current = region;
      onRegionChangeComplete?.(regionToBounds(region), region);
    },
    [onRegionChangeComplete],
  );

  const handleMapReady = useCallback(() => {
    setMapReady(true);
    handleAndroidMapReady();
  }, [handleAndroidMapReady]);

  const zoomByFactor = useCallback((factor: number) => {
    const region = regionRef.current;
    mapRef.current?.animateToRegion({
      ...region,
      latitudeDelta: Math.min(180, Math.max(0.001, region.latitudeDelta * factor)),
      longitudeDelta: Math.min(360, Math.max(0.001, region.longitudeDelta * factor)),
    });
  }, []);

  return (
    <View
      className="min-h-0 w-full flex-1 overflow-hidden rounded-2xl border border-border bg-card"
      onLayout={handleContainerLayout}
    >
      {mapLayoutReady && (
        <MapView
          key={isAndroid ? `android-map-${androidMapKey}` : 'map'}
          ref={mapRef}
          provider={NATIVE_MAP_PROVIDER}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          onMapReady={handleMapReady}
          onMapLoaded={handleMapLoaded}
          onRegionChangeComplete={handleRegionComplete}
          loadingEnabled={isAndroid}
          loadingBackgroundColor={Theme.colors.card}
          loadingIndicatorColor={Theme.colors.primary}
          showsPointsOfInterest
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={isAndroid}
        >
          {markers.map((marker) => (
            <NativeMarker
              key={isAndroid ? `${androidMapKey}-${marker.id}` : marker.id}
              marker={marker}
              active={isIos ? false : selectedId === marker.id}
              onPress={onMarkerPress}
            />
          ))}
          {iosSelectedMarker && (
            <NativeMarker
              key={`ios-selected-${iosSelectedMarker.id}`}
              marker={iosSelectedMarker}
              active
              onPress={onMarkerPress}
            />
          )}
        </MapView>
      )}

      <MapZoomControls
        onZoomIn={() => zoomByFactor(ZOOM_IN_FACTOR)}
        onZoomOut={() => zoomByFactor(ZOOM_OUT_FACTOR)}
      />
    </View>
  );
};

export default MarkerMap;
