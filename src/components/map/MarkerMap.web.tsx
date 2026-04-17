import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import type { MapMarkerItem, MapRecenterTarget } from '~/types/map/mapMarker';
import { MAP_VIEW_MIN_HEIGHT } from '~/constants/map/mapUi';
import {
  createWebMapPinIconUrl,
  WEB_MAP_DEFAULT_CENTER,
  createFitBoundsHandler,
  isValidMapCoordinate,
  triggerGoogleMapResize,
} from '~/utils/map/webMapCamera';
import type { LatLngBounds } from '~/utils/map/mapRecommendationData';

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
  const { width: windowWidth } = useWindowDimensions();
  const [mapBox, setMapBox] = useState({ w: 0, h: 0 });

  const onMapLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    setMapBox((prev) =>
      prev.w === width && prev.h === height ? prev : { w: width, h: height },
    );
  }, []);

  const pixelHeight = mapBox.h > 0 ? mapBox.h : MAP_VIEW_MIN_HEIGHT;

  const containerStyle = useMemo(
    () => ({
      width: '100%',
      height: pixelHeight,
      borderRadius: 16,
    }),
    [pixelHeight],
  );

  const mapOptions = useMemo((): google.maps.MapOptions => {
    return {
      disableDefaultUI: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      rotateControl: false,
      scaleControl: false,
      minZoom: 2,
      maxZoom: 22,
      gestureHandling: 'greedy',
      center: { lat: WEB_MAP_DEFAULT_CENTER.lat, lng: WEB_MAP_DEFAULT_CENTER.lng },
      zoom: 11,
    };
  }, []);

  const validMarkers = useMemo(
    () => markers.filter((m) => isValidMapCoordinate(m.latitude, m.longitude)),
    [markers],
  );

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const fitBounds = useMemo(() => createFitBoundsHandler(validMarkers), [validMarkers]);

  const pushBoundsToParent = useCallback(
    (map: google.maps.Map) => {
      const b = map.getBounds();
      if (b && onRegionChangeComplete) {
        onRegionChangeComplete({
          min_lat: b.getSouthWest().lat(),
          max_lat: b.getNorthEast().lat(),
          min_lng: b.getSouthWest().lng(),
          max_lng: b.getNorthEast().lng(),
        });
      }
    },
    [onRegionChangeComplete],
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      setMapReady(true);
      const sync = () => {
        triggerGoogleMapResize(map);
        fitBounds(map);
        pushBoundsToParent(map);
      };
      sync();
      requestAnimationFrame(sync);
      window.setTimeout(sync, 50);
      window.setTimeout(sync, 300);
    },
    [fitBounds, pushBoundsToParent],
  );

  const onIdle = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    triggerGoogleMapResize(map);
    if (!onRegionChangeComplete) return;
    const b = map.getBounds();
    if (!b) return;
    onRegionChangeComplete({
      min_lat: b.getSouthWest().lat(),
      max_lat: b.getNorthEast().lat(),
      min_lng: b.getSouthWest().lng(),
      max_lng: b.getNorthEast().lng(),
    });
  }, [onRegionChangeComplete]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    triggerGoogleMapResize(map);
    requestAnimationFrame(() => triggerGoogleMapResize(map));
  }, [pixelHeight, mapBox.w, windowWidth]);

  useLayoutEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map || !recenterTo) return;
    if (!isValidMapCoordinate(recenterTo.latitude, recenterTo.longitude)) return;
    map.panTo({ lat: recenterTo.latitude, lng: recenterTo.longitude });
    map.setZoom(14);
    requestAnimationFrame(() => triggerGoogleMapResize(map));
  }, [recenterTo, mapReady]);

  if (!apiKey) {
    return (
      <View
        className="w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/20 px-4"
        style={{ minHeight: MAP_VIEW_MIN_HEIGHT }}
        onLayout={onMapLayout}
      >
        <Text className="text-center text-sm text-muted-foreground">
          Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to your .env to show Google Maps on web.
        </Text>
      </View>
    );
  }

  return (
    <View
      className="min-h-0 w-full flex-1 self-stretch overflow-hidden rounded-2xl border border-border bg-card"
      style={{ minHeight: MAP_VIEW_MIN_HEIGHT }}
      onLayout={onMapLayout}
    >
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={
          <View
            className="w-full flex-1 bg-muted/30"
            style={{ height: pixelHeight, minHeight: MAP_VIEW_MIN_HEIGHT }}
          />
        }
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onMapLoad}
          onIdle={onIdle}
          options={mapOptions}
        >
          {validMarkers.map((m) => (
            <Marker
              key={m.id}
              position={{ lat: m.latitude, lng: m.longitude }}
              icon={{ url: createWebMapPinIconUrl(m) }}
              zIndex={selectedId === m.id ? 1000 : 1}
              onClick={() => onMarkerPress(m.id)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </View>
  );
};

export default MarkerMap;
