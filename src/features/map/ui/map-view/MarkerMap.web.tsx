import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MAP_VIEW_MIN_HEIGHT } from '~/features/map/config/mapUi';
import { useWebGoogleMap } from '~/features/map/hooks/platform/useWebGoogleMap';
import { isValidMapCoordinate } from '~/features/map/lib/webMapCamera';
import type { MarkerMapProps } from '~/features/map/types/markerMap';
import MapZoomControls from '~/features/map/ui/map-view/MapZoomControls';
import WebMapLoading from '~/features/map/ui/map-view/WebMapLoading';
import WebMapMarker from '~/features/map/ui/map-view/WebMapMarker';
import WebMapMessage from '~/features/map/ui/map-view/WebMapMessage';

const GOOGLE_MAPS_SCRIPT_ID = 'trurex-google-maps-js';
const MISSING_KEY_MESSAGE =
  'Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to your .env to show Google Maps on web.';
const LOAD_ERROR_MESSAGE =
  'Could not load Google Maps. Check the API key and Maps JavaScript API enablement.';

type InnerProps = MarkerMapProps & { apiKey: string };

const MarkerMapWithLoader = ({
  apiKey,
  markers,
  selectedId,
  onMarkerPress,
  initialRegion,
  onRegionChangeComplete,
  recenterTo,
}: InnerProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_SCRIPT_ID,
    googleMapsApiKey: apiKey,
    version: 'quarterly',
    preventGoogleFontsLoading: true,
  });
  const { width: windowWidth } = useWindowDimensions();
  const [mapBox, setMapBox] = useState({ w: 0, h: 0 });
  const onMapLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    setMapBox((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
  }, []);

  const pixelHeight = mapBox.h > 0 ? mapBox.h : MAP_VIEW_MIN_HEIGHT;
  const containerStyle = useMemo(
    () => ({ width: '100%', height: pixelHeight, borderRadius: 16 }),
    [pixelHeight],
  );

  const validMarkers = useMemo(
    () => markers.filter((m) => isValidMapCoordinate(m.latitude, m.longitude)),
    [markers],
  );

  const { resizeForLayout, onMapLoad, onIdle, mapOptions, zoomBy } = useWebGoogleMap({
    onRegionChangeComplete,
    recenterTo,
    validMarkers,
    initialRegion,
  });

  useEffect(() => {
    resizeForLayout();
  }, [pixelHeight, mapBox.w, windowWidth, resizeForLayout]);

  if (loadError) return <WebMapMessage message={LOAD_ERROR_MESSAGE} onLayout={onMapLayout} />;
  if (!isLoaded) return <WebMapLoading pixelHeight={pixelHeight} onLayout={onMapLayout} />;

  return (
    <View
      className="min-h-0 w-full flex-1 self-stretch overflow-hidden rounded-2xl border border-border bg-card"
      style={{ minHeight: MAP_VIEW_MIN_HEIGHT }}
      onLayout={onMapLayout}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onMapLoad}
        onIdle={onIdle}
        options={mapOptions}
      >
        {validMarkers.map((marker) => (
          <WebMapMarker
            key={marker.id}
            marker={marker}
            selected={selectedId === marker.id}
            onPress={onMarkerPress}
          />
        ))}
      </GoogleMap>

      <MapZoomControls onZoomIn={() => zoomBy(1)} onZoomOut={() => zoomBy(-1)} />
    </View>
  );
};

const MarkerMap = (props: MarkerMapProps) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  if (!apiKey) return <WebMapMessage message={MISSING_KEY_MESSAGE} />;
  return <MarkerMapWithLoader {...props} apiKey={apiKey} />;
};

export default MarkerMap;
