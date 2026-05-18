import type { Region } from 'react-native-maps';
import type { MapPinRow } from '~/types/map/mapPinRow';
import type { Recommendation } from '~/types/recommendation/recommendation';
import type { MapMarkerItem } from '~/types/map/mapMarker';
import type { MapPinType, PinVisibility } from '~/types/map/mapPin';
import { MAP_PIN_COLOR, MAP_PIN_GLYPH } from '~/types/map/mapPin';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/utils/recommendation/recContentDisplay';

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

const EMPTY_REGION: Region = {
  latitude: -33.8688,
  longitude: 151.2093,
  latitudeDelta: 0.45,
  longitudeDelta: 0.45,
};

export function regionForMarkers(markers: MapMarkerItem[]): Region {
  if (markers.length === 0) return EMPTY_REGION;
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

const EARTH_KM = 6371;

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

export function filterLocatedRecommendations(recs: Recommendation[]): Recommendation[] {
  return recs.filter((r) => r.latitude != null && r.longitude != null);
}

export function filterRecommendationsByRexTitle(
  recs: Recommendation[],
  rawQuery: string,
): Recommendation[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return recs;
  return recs.filter((r) => r.title.toLowerCase().includes(q));
}

export function filterRecommendationsBySearchQuery(
  recs: Recommendation[],
  rawQuery: string,
): Recommendation[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return recs;
  return recs.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
      (r.description ?? '').toLowerCase().includes(q),
  );
}

export function filterRecommendationsByCategoryId(
  recs: Recommendation[],
  categoryId: string,
): Recommendation[] {
  if (categoryId === 'all') return recs;
  return recs.filter((r) => r.categoryId === categoryId);
}

export function apiPinTypeToMapPinType(
  pinType: MapPinRow['pin_type'],
  row: Pick<MapPinRow, 'is_saved'>,
): MapPinType {
  if (pinType === 'overlap') return 'overlap';
  if (pinType === 'saved') return 'saved';
  if (pinType === 'been_there') return 'beenHere';
  if (pinType === 'trusted') return 'network';
  if (row.is_saved) return 'saved';
  return 'network';
}

export function mapPinRowToMapMarkerItem(row: MapPinRow): MapMarkerItem {
  const pinType = apiPinTypeToMapPinType(row.pin_type, row);
  return {
    id: row.rex_id,
    latitude: row.latitude,
    longitude: row.longitude,
    title: row.place_name || 'Place',
    subtitle: row.place_name,
    pinType,
    glyph: MAP_PIN_GLYPH[pinType],
    pinColor: MAP_PIN_COLOR[pinType],
  };
}

export function pinRowPassesLayerVisibility(row: MapPinRow, layers: PinVisibility): boolean {
  const pinType = apiPinTypeToMapPinType(row.pin_type, row);
  return pinTypeVisible(pinType, layers);
}

export function isOwnRecommendation(
  rec: Pick<Recommendation, 'authorId'>,
  currentUserId: string | null | undefined,
): boolean {
  const uid = currentUserId?.trim() ?? '';
  const author = rec.authorId?.trim() ?? '';
  return uid.length > 0 && author.length > 0 && author === uid;
}

export function deriveMapPinType(
  rec: Recommendation,
  currentUserId: string | null | undefined,
): MapPinType {
  const own = isOwnRecommendation(rec, currentUserId);
  const saved = rec.isSaved;

  if (own && saved) return 'overlap';
  if (own) return 'beenHere';
  if (saved) return 'saved';
  return 'network';
}

function pinTypeVisible(
  pinType: MapPinType,
  layers: { network: boolean; saved: boolean; beenHere: boolean },
): boolean {
  if (pinType === 'overlap') return layers.network && layers.saved;
  if (pinType === 'network') return layers.network;
  if (pinType === 'saved') return layers.saved;
  return layers.beenHere;
}

export function filterRecommendationsByPinLayers(
  recs: Recommendation[],
  layers: PinVisibility,
  userId: string | null,
): Recommendation[] {
  return recs.filter((r) => pinTypeVisible(deriveMapPinType(r, userId), layers));
}

export function recommendationToMapMarker(
  rec: Recommendation,
  currentUserId: string | null | undefined,
): MapMarkerItem | null {
  if (rec.latitude == null || rec.longitude == null) return null;
  const pinType = deriveMapPinType(rec, currentUserId);
  const http = rexCoverRemoteHttpUrl(rec);
  const storage = rexCoverStoragePathFromRecommendation(rec);
  return {
    id: rec.id,
    latitude: rec.latitude,
    longitude: rec.longitude,
    title: rec.title,
    subtitle: rec.location,
    pinType,
    glyph: MAP_PIN_GLYPH[pinType],
    pinColor: MAP_PIN_COLOR[pinType],
    imageUrl: http ?? undefined,
    imageStoragePath: http ? undefined : (storage ?? undefined),
  };
}
