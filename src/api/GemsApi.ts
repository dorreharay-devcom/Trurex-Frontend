import { Backend, unwrap } from '~/services/AuthService';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { mapDiscoverFeedRowSafe } from '~/api/mapDiscoverFeed';

export interface SavedRexesParams {
  result_limit?: number;
  result_offset?: number;
  search_term?: string | null;
  uncollected?: boolean;
}

export const GemsApi = {
  getSavedRexes: async (params: SavedRexesParams = {}): Promise<Recommendation[]> => {
    const rpcParams: Record<string, unknown> = {
      result_limit: params.result_limit ?? 20,
      result_offset: params.result_offset ?? 0,
      search_term: params.search_term?.trim() || null,
    };
    if (params.uncollected === true) rpcParams.uncollected = true;

    const raw = unwrap(await Backend.rpc('saved_rexes_view', rpcParams));
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((row) => {
      const rec = mapDiscoverFeedRowSafe(row);
      return rec ? [rec] : [];
    });
  },
};
