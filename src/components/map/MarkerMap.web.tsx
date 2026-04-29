import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import type { MapMarkerItem, MapRecenterTarget } from '~/types/map/mapMarker';
import { MAP_ACTION_INSET, MAP_VIEW_MIN_HEIGHT, MAP_ZOOM_CONTROLS_BOTTOM } from '~/constants/map/mapUi';
import { Theme } from '~/theme/Theme';
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

const GOOGLE_MAPS_SCRIPT_ID = 'trurex-google-maps-js';

type InnerProps = Props & { apiKey: string };

const MarkerMapWithLoader: React.FC<InnerProps> = ({
  apiKey,
  markers,
  selectedId,
  onMarkerPress,
  onRegionChangeComplete,
  recenterTo,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_SCRIPT_ID,
    googleMapsApiKey: apiKey,
    version: 'quarterly',
    preventGoogleFontsLoading: true,
  });
  const { width: windowWidth } = useWindowDimensions();
  const [mapBox, setMapBox] = useState({ w: 0, h: 0 });

  const onMapLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    setMapBox((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
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

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const validMarkersRef = useRef(validMarkers);
  validMarkersRef.current = validMarkers;

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
    if (recenterTo.fitMarkers) {
      const vm = validMarkersRef.current;
      if (vm.length > 0) {
        createFitBoundsHandler(vm)(map);
        requestAnimationFrame(() => triggerGoogleMapResize(map));
      }
      return;
    }
    if (!isValidMapCoordinate(recenterTo.latitude, recenterTo.longitude)) return;
    map.panTo({ lat: recenterTo.latitude, lng: recenterTo.longitude });
    map.setZoom(14);
    requestAnimationFrame(() => triggerGoogleMapResize(map));
  }, [recenterTo, mapReady]);

  const zoomBy = useCallback((delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const z = map.getZoom() ?? 11;
    const next = Math.min(22, Math.max(2, z + delta));
    map.setZoom(next);
    requestAnimationFrame(() => triggerGoogleMapResize(map));
  }, []);

  if (loadError) {
    return (
      <View
        className="w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/20 px-4"
        style={{ minHeight: MAP_VIEW_MIN_HEIGHT }}
        onLayout={onMapLayout}
      >
        <Text className="text-center text-sm text-muted-foreground">
          Could not load Google Maps. Check the API key and Maps JavaScript API enablement.
        </Text>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View
        className="min-h-0 w-full flex-1 self-stretch overflow-hidden rounded-2xl border border-border bg-card"
        style={{ minHeight: MAP_VIEW_MIN_HEIGHT }}
        onLayout={onMapLayout}
      >
        <View
          className="w-full flex-1 bg-muted/30"
          style={{ height: pixelHeight, minHeight: MAP_VIEW_MIN_HEIGHT }}
        />
      </View>
    );
  }

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
          onPress={() => zoomBy(1)}
          className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-md active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Zoom in"
        >
          <Plus size={18} color={Theme.colors.foreground} />
        </Pressable>
        <Pressable
          onPress={() => zoomBy(-1)}
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

const MarkerMap: React.FC<Props> = (props) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  if (!apiKey) {
    return (
      <View
        className="w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/20 px-4"
        style={{ minHeight: MAP_VIEW_MIN_HEIGHT }}
      >
        <Text className="text-center text-sm text-muted-foreground">
          Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to your .env to show Google Maps on web.
        </Text>
      </View>
    );
  }

  return <MarkerMapWithLoader {...props} apiKey={apiKey} />;
};

export default MarkerMap;
