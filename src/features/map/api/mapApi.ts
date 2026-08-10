import { Backend, unwrap } from '~/shared/api/client';
import { mapApiRowToRecommendation } from '~/shared/lib/recommendation';
import type { Recommendation } from '~/shared/types/recommendation';
import type { MapPinRow } from '~/features/map/types/mapPinRow';
import { filterRecommendationsByRexTitle } from '~/features/map/lib/filters';
import { API_PIN_TYPE } from '~/features/map/config/pins';
import { finiteNum } from '~/shared/lib/data/guards';

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

export type { MapPinRow } from '~/features/map/types/mapPinRow';

const API_PIN_TYPES = new Set<string>(Object.values(API_PIN_TYPE));

function parseApiPinType(pinRaw: unknown): MapPinRow['pin_type'] {
  if (typeof pinRaw !== 'string') return null;
  if (!API_PIN_TYPES.has(pinRaw)) return null;
  return pinRaw as MapPinRow['pin_type'];
}

function parseMapPinRow(row: Record<string, unknown>): MapPinRow | null {
  const rex_id = String(row.rex_id ?? row.id ?? '').trim();
  if (!rex_id) return null;
  const lat = Number(row.latitude);
  const lng = Number(row.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    rex_id,
    place_id: String(row.place_id ?? ''),
    place_name: String(row.place_name ?? ''),
    place_rex_author_count: finiteNum(row.place_rex_author_count),
    latitude: lat,
    longitude: lng,
    category_code: String(row.category_code ?? ''),
    category_name: String(row.category_name ?? ''),
    category_icon: row.category_icon != null ? String(row.category_icon) : null,
    category_color: row.category_color != null ? String(row.category_color) : null,
    is_saved: Boolean(row.is_saved),
    pin_type: parseApiPinType(row.pin_type),
  };
}

function normalizeSearchTerm(term: string | null | undefined): string | null {
  const t = term?.trim() ?? '';
  return t.length > 0 ? t : null;
}

function mapPinsRpcPayload(params: MapBoundsParams) {
  return {
    min_lat: params.min_lat,
    max_lat: params.max_lat,
    min_lng: params.min_lng,
    max_lng: params.max_lng,
    category_filter: params.category_filter ?? null,
    search_term: normalizeSearchTerm(params.search_term),
    result_limit: params.result_limit ?? 500,
    result_offset: params.result_offset ?? 0,
  };
}

function mapRexesRpcPayload(params: MapBoundsParams) {
  return {
    min_lat: params.min_lat,
    max_lat: params.max_lat,
    min_lng: params.min_lng,
    max_lng: params.max_lng,
    category_filter: params.category_filter ?? null,
    result_limit: params.result_limit ?? 100,
    result_offset: params.result_offset ?? 0,
  };
}

export const MapApi = {
  mapRexesInBounds: async (params: MapBoundsParams): Promise<Recommendation[]> => {
    const raw = unwrap(await Backend.rpc('map_rexes_in_bounds', mapRexesRpcPayload(params)));
    if (!Array.isArray(raw)) return [];
    const recs = raw.flatMap((row) => {
      const rec = mapApiRowToRecommendation(row);
      return rec ? [rec] : [];
    });
    const term = normalizeSearchTerm(params.search_term);
    if (term) return filterRecommendationsByRexTitle(recs, term);
    return recs;
  },

  mapRexPins: async (params: MapBoundsParams): Promise<MapPinRow[]> => {
    const raw = unwrap(await Backend.rpc('map_rex_pins', mapPinsRpcPayload(params)));
    if (!Array.isArray(raw)) return [];
    return (raw as Record<string, unknown>[])
      .map((row) => parseMapPinRow(row))
      .filter((r): r is MapPinRow => r != null);
  },
};
