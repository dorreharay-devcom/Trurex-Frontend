import { Backend, unwrap } from '~/services/AuthService';
import { mapDiscoverFeedRowSafe } from '~/api/mapDiscoverFeed';
import { mockMapRexesForBounds } from '~/data/mockMapRexes';
import type { Recommendation } from '~/types/recommendation/recommendation';

export type MapBoundsParams = {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
  category_filter?: string | null;
  result_limit?: number;
  result_offset?: number;
};

export type MapPinRow = {
  rex_id: string;
  place_id: string;
  place_name: string;
  latitude: number;
  longitude: number;
  category_code: string;
};

export const MapApi = {
  mapRexesInBounds: async (params: MapBoundsParams): Promise<Recommendation[]> => {
    try {
      const raw = unwrap(
        await Backend.rpc('map_rexes_in_bounds', {
          min_lat: params.min_lat,
          max_lat: params.max_lat,
          min_lng: params.min_lng,
          max_lng: params.max_lng,
          category_filter: params.category_filter ?? null,
          result_limit: params.result_limit ?? 100,
          result_offset: params.result_offset ?? 0,
        }),
      );
      if (!Array.isArray(raw)) return mockMapRexesForBounds(params);
      const mapped = raw.flatMap((row) => {
        const rec = mapDiscoverFeedRowSafe(row);
        return rec ? [rec] : [];
      });
      return mapped.length > 0 ? mapped : mockMapRexesForBounds(params);
    } catch {
      return mockMapRexesForBounds(params);
    }
  },

  mapRexPins: async (params: MapBoundsParams): Promise<MapPinRow[]> => {
    const raw = unwrap(
      await Backend.rpc('map_rex_pins', {
        min_lat: params.min_lat,
        max_lat: params.max_lat,
        min_lng: params.min_lng,
        max_lng: params.max_lng,
        category_filter: params.category_filter ?? null,
        result_limit: params.result_limit ?? 500,
        result_offset: params.result_offset ?? 0,
      }),
    );
    if (!Array.isArray(raw)) return [];
    return raw.map((row) => {
      const o = row as Record<string, unknown>;
      return {
        rex_id: String(o.rex_id ?? o.id ?? ''),
        place_id: String(o.place_id ?? ''),
        place_name: String(o.place_name ?? ''),
        latitude: Number(o.latitude),
        longitude: Number(o.longitude),
        category_code: String(o.category_code ?? ''),
      };
    });
  },
};
