import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  createFitBoundsHandler,
  isValidMapCoordinate,
  triggerGoogleMapResize,
  WEB_MAP_DEFAULT_CENTER,
} from '~/features/map/lib/webMapCamera';
import type { LatLngBounds } from '~/features/map/lib/geo';
import type { MapMarkerItem, MapRecenterTarget } from '~/features/map/types/mapMarker';
import type { Region } from 'react-native-maps';

const RECENTER_ZOOM = 14;

type Params = {
  onRegionChangeComplete?: (bounds: LatLngBounds, region: Region) => void;
  recenterTo?: MapRecenterTarget | null;
  validMarkers: MapMarkerItem[];
  initialRegion?: Region;
};

function boundsFromGoogleMap(map: google.maps.Map): LatLngBounds | null {
  const b = map.getBounds();
  if (!b) return null;
  return {
    min_lat: b.getSouthWest().lat(),
    max_lat: b.getNorthEast().lat(),
    min_lng: b.getSouthWest().lng(),
    max_lng: b.getNorthEast().lng(),
  };
}

function regionFromBounds(bounds: LatLngBounds): Region {
  return {
    latitude: (bounds.min_lat + bounds.max_lat) / 2,
    longitude: (bounds.min_lng + bounds.max_lng) / 2,
    latitudeDelta: Math.max(bounds.max_lat - bounds.min_lat, 0.001),
    longitudeDelta: Math.max(bounds.max_lng - bounds.min_lng, 0.001),
  };
}

function webMapOptionsFromRegion(initialRegion?: Region): google.maps.MapOptions {
  const center = initialRegion
    ? { lat: initialRegion.latitude, lng: initialRegion.longitude }
    : { lat: WEB_MAP_DEFAULT_CENTER.lat, lng: WEB_MAP_DEFAULT_CENTER.lng };
  const zoom = initialRegion
    ? Math.min(22, Math.max(2, Math.round(Math.log2(360 / initialRegion.longitudeDelta))))
    : 11;

  return {
    disableDefaultUI: true,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: false,
    rotateControl: false,
    scaleControl: false,
    clickableIcons: false,
    keyboardShortcuts: false,
    minZoom: 2,
    maxZoom: 22,
    gestureHandling: 'greedy',
    center,
    zoom,
  };
}

export function useWebGoogleMap({
  onRegionChangeComplete,
  recenterTo,
  validMarkers,
  initialRegion,
}: Params) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const validMarkersRef = useRef(validMarkers);
  validMarkersRef.current = validMarkers;
  const initialRegionRef = useRef(initialRegion);
  const mapOptions = useMemo(() => webMapOptionsFromRegion(initialRegionRef.current), []);

  const pushBoundsToParent = useCallback(
    (map: google.maps.Map) => {
      if (!onRegionChangeComplete) return;
      const bounds = boundsFromGoogleMap(map);
      if (!bounds) return;
      onRegionChangeComplete(bounds, regionFromBounds(bounds));
    },
    [onRegionChangeComplete],
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      setMapReady(true);
      triggerGoogleMapResize(map);
      requestAnimationFrame(() => {
        triggerGoogleMapResize(map);
        pushBoundsToParent(map);
      });
    },
    [pushBoundsToParent],
  );

  const onIdle = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    pushBoundsToParent(map);
  }, [pushBoundsToParent]);

  useLayoutEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map || !recenterTo) return;

    if (recenterTo.fitCoords?.length) {
      createFitBoundsHandler(
        recenterTo.fitCoords.map((c) => ({
          id: 'fit',
          latitude: c.latitude,
          longitude: c.longitude,
          title: '',
          pinType: 'rex' as const,
          glyph: '',
          pinColor: '',
        })),
      )(map);
      requestAnimationFrame(() => triggerGoogleMapResize(map));
      return;
    }

    if (recenterTo.fitMarkers) {
      const markers = validMarkersRef.current;
      if (markers.length === 0) return;
      createFitBoundsHandler(markers)(map);
      requestAnimationFrame(() => triggerGoogleMapResize(map));
      return;
    }

    if (!isValidMapCoordinate(recenterTo.latitude, recenterTo.longitude)) return;
    map.panTo({ lat: recenterTo.latitude, lng: recenterTo.longitude });
    map.setZoom(RECENTER_ZOOM);
    requestAnimationFrame(() => triggerGoogleMapResize(map));
  }, [recenterTo, mapReady]);

  const zoomBy = useCallback((delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const zoom = map.getZoom() ?? 11;
    map.setZoom(Math.min(22, Math.max(2, zoom + delta)));
    requestAnimationFrame(() => triggerGoogleMapResize(map));
  }, []);

  const resizeForLayout = useCallback(() => {
    triggerGoogleMapResize(mapRef.current);
    requestAnimationFrame(() => triggerGoogleMapResize(mapRef.current));
  }, []);

  return { onMapLoad, onIdle, zoomBy, resizeForLayout, mapReady, mapOptions };
}
