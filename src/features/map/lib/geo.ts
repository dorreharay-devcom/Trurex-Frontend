import type { Region } from 'react-native-maps';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';

export type LatLngBounds = {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
};

export const DEFAULT_MAP_BOUNDS: LatLngBounds = {
  min_lat: -34.2,
  max_lat: -33.6,
  min_lng: 150.8,
  max_lng: 151.35,
};

const EMPTY_REGION: Region = {
  latitude: -33.8688,
  longitude: 151.2093,
  latitudeDelta: 0.45,
  longitudeDelta: 0.45,
};

const EARTH_KM = 6371;

export function boundsToRegion(bounds: LatLngBounds): Region {
  return {
    latitude: (bounds.min_lat + bounds.max_lat) / 2,
    longitude: (bounds.min_lng + bounds.max_lng) / 2,
    latitudeDelta: Math.max(bounds.max_lat - bounds.min_lat, 0.001),
    longitudeDelta: Math.max(bounds.max_lng - bounds.min_lng, 0.001),
  };
}

export function regionToBounds(region: Region): LatLngBounds {
  const halfLat = region.latitudeDelta / 2;
  const halfLng = region.longitudeDelta / 2;
  return {
    min_lat: region.latitude - halfLat,
    max_lat: region.latitude + halfLat,
    min_lng: region.longitude - halfLng,
    max_lng: region.longitude + halfLng,
  };
}

export function roundBounds(bounds: LatLngBounds, decimals = 4): LatLngBounds {
  const f = 10 ** decimals;
  return {
    min_lat: Math.round(bounds.min_lat * f) / f,
    max_lat: Math.round(bounds.max_lat * f) / f,
    min_lng: Math.round(bounds.min_lng * f) / f,
    max_lng: Math.round(bounds.max_lng * f) / f,
  };
}

export function expandBounds(bounds: LatLngBounds, factor: number): LatLngBounds {
  const latPad = Math.max((bounds.max_lat - bounds.min_lat) * factor, 0.002);
  const lngPad = Math.max((bounds.max_lng - bounds.min_lng) * factor, 0.002);
  return {
    min_lat: bounds.min_lat - latPad,
    max_lat: bounds.max_lat + latPad,
    min_lng: bounds.min_lng - lngPad,
    max_lng: bounds.max_lng + lngPad,
  };
}

export function isViewportCoveredBy(view: LatLngBounds, coverage: LatLngBounds): boolean {
  return (
    view.min_lat >= coverage.min_lat &&
    view.max_lat <= coverage.max_lat &&
    view.min_lng >= coverage.min_lng &&
    view.max_lng <= coverage.max_lng
  );
}

export function isLatLngInBounds(
  latitude: number,
  longitude: number,
  bounds: LatLngBounds,
): boolean {
  return (
    latitude >= bounds.min_lat &&
    latitude <= bounds.max_lat &&
    longitude >= bounds.min_lng &&
    longitude <= bounds.max_lng
  );
}

export function regionForMarkers(markers: MapMarkerItem[]): Region {
  if (markers.length === 0) return EMPTY_REGION;
  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;
  const latPad = Math.max(0.02, latSpan * 0.15);
  const lngPad = Math.max(0.02, lngSpan * 0.15);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(latSpan + latPad * 2, 0.08),
    longitudeDelta: Math.max(lngSpan + lngPad * 2, 0.08),
  };
}

export function haversineKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return EARTH_KM * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function sortRecommendationsByDistance<T extends RecommendationWithCoords>(
  rows: readonly T[],
  userCoords: { latitude: number; longitude: number } | null,
): T[] {
  if (!userCoords) return [...rows];
  return [...rows].sort((a, b) => {
    if (a.latitude == null || a.longitude == null) return 1;
    if (b.latitude == null || b.longitude == null) return -1;
    return (
      haversineKm(userCoords, { latitude: a.latitude, longitude: a.longitude }) -
      haversineKm(userCoords, { latitude: b.latitude, longitude: b.longitude })
    );
  });
}

type RecommendationWithCoords = {
  latitude?: number | null;
  longitude?: number | null;
};
