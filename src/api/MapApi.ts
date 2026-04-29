import { Backend, unwrap } from '~/services/AuthService';
import { mapDiscoverFeedRowSafe } from '~/api/mapDiscoverFeed';
import type { Recommendation } from '~/types/recommendation/recommendation';
import type { MapPinRow } from '~/types/map/mapPinRow';
import { filterRecommendationsByRexTitle } from '~/utils/map/mapRecommendationData';

export type MapBoundsParams = {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
  category_filter?: string | null;
  search_term?: string | null;
  result_limit?: number;
  result_offset?: number;
};

export type { MapPinRow } from '~/types/map/mapPinRow';

function parseMapPinRow(row: Record<string, unknown>): MapPinRow | null {
  const rex_id = String(row.rex_id ?? row.id ?? '').trim();
  if (!rex_id) return null;
  const lat = Number(row.latitude);
  const lng = Number(row.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const pinRaw = row.pin_type;
  const pin_type =
    pinRaw === 'trusted' || pinRaw === 'saved' || pinRaw === 'been_there' || pinRaw === 'overlap'
      ? pinRaw
      : null;
  return {
    rex_id,
    place_id: String(row.place_id ?? ''),
    place_name: String(row.place_name ?? ''),
    place_rex_author_count:
      typeof row.place_rex_author_count === 'number' && Number.isFinite(row.place_rex_author_count)
        ? row.place_rex_author_count
        : 0,
    latitude: lat,
    longitude: lng,
    category_code: String(row.category_code ?? ''),
    category_name: String(row.category_name ?? ''),
    category_icon: row.category_icon != null ? String(row.category_icon) : null,
    category_color: row.category_color != null ? String(row.category_color) : null,
    is_saved: Boolean(row.is_saved),
    pin_type,
  };
}

function rpcBoundsPayload(params: MapBoundsParams, defaultLimit: number) {
  return {
    min_lat: params.min_lat,
    max_lat: params.max_lat,
    min_lng: params.min_lng,
    max_lng: params.max_lng,
    category_filter: params.category_filter ?? null,
    result_limit: params.result_limit ?? defaultLimit,
    result_offset: params.result_offset ?? 0,
  };
}

function filterPinRowsByRexName(rows: MapPinRow[], rawQuery: string): MapPinRow[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => r.place_name.toLowerCase().includes(q));
}

export const MapApi = {
  mapRexesInBounds: async (params: MapBoundsParams): Promise<Recommendation[]> => {
    const raw = unwrap(await Backend.rpc('map_rexes_in_bounds', rpcBoundsPayload(params, 100)));
    if (!Array.isArray(raw)) return [];
    let recs = raw.flatMap((row) => {
      const rec = mapDiscoverFeedRowSafe(row);
      return rec ? [rec] : [];
    });
    const term = params.search_term?.trim();
    if (term) recs = filterRecommendationsByRexTitle(recs, term);
    return recs;
  },

  mapRexPins: async (params: MapBoundsParams): Promise<MapPinRow[]> => {
    const raw = unwrap(await Backend.rpc('map_rex_pins', rpcBoundsPayload(params, 500)));
    if (!Array.isArray(raw)) return [];
    let pins = (raw as Record<string, unknown>[])
      .map((row) => parseMapPinRow(row))
      .filter((r): r is MapPinRow => r != null);
    const term = params.search_term?.trim();
    if (term) pins = filterPinRowsByRexName(pins, term);
    return pins;
  },
};
