import type { Region } from 'react-native-maps';
import type { MapMarkerItem } from '~/types/map/mapMarker';

const DEFAULT_REGION: Region = {
  latitude: 34.05,
  longitude: -118.25,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

export function regionForMarkers(markers: MapMarkerItem[]): Region {
  if (markers.length === 0) return DEFAULT_REGION;
  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const pad = 0.02;
  const latDelta = Math.max(maxLat - minLat + pad * 2, 0.08);
  const lngDelta = Math.max(maxLng - minLng + pad * 2, 0.08);
  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}
