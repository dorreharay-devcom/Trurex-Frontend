import { Backend, unwrap } from '~/shared/api/client';
import type { Recommendation } from '~/shared/types/recommendation';
import type { SavedRexesParams } from '~/features/collections/types/savedRexes';
import { mapDiscoverFeedRowSafe } from '~/api/mapDiscoverFeed';

export const GemsApi = {
  getSavedRexes: async (params: SavedRexesParams = {}): Promise<Recommendation[]> => {
    const rpcParams: Record<string, unknown> = {
      result_limit: params.result_limit ?? 20,
      result_offset: params.result_offset ?? 0,
      search_term: params.search_term?.trim() || null,
    };
    if (params.uncollected) rpcParams.uncollected = true;

    const raw = unwrap(await Backend.rpc('saved_rexes_view', rpcParams));
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((row) => {
      const rec = mapDiscoverFeedRowSafe(row);
      return rec ? [rec] : [];
    });
  },
};
