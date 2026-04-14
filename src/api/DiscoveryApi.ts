import { Backend, unwrap } from '~/services/AuthService';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { mapDiscoverFeedRowSafe } from '~/api/mapDiscoverFeed';

export interface DiscoverQueryParams {
  result_limit?: number;
  result_offset?: number;
}

export const DiscoveryApi = {
  getDiscoverRecommendations: async (
    params: DiscoverQueryParams = {},
  ): Promise<Recommendation[]> => {
    const raw = unwrap(
      await Backend.rpc('discover_feed', {
        result_limit: params.result_limit ?? 20,
        result_offset: params.result_offset ?? 0,
      }),
    );
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((row) => {
      const rec = mapDiscoverFeedRowSafe(row);
      return rec ? [rec] : [];
    });
  },
};
