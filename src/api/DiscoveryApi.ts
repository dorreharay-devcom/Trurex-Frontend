import { Backend, unwrap } from '~/services/AuthService';
import type { Recommendation } from '~/types/recommendation/recommendation';

export interface DiscoverFeedParams {
  result_limit?: number;
  result_offset?: number;
}

export const DiscoveryApi = {
  getDiscoverFeed: async (params: DiscoverFeedParams = {}): Promise<Recommendation[]> => {
    return unwrap(
      await Backend.rpc('discover_feed', {
        result_limit: params.result_limit ?? 20,
        result_offset: params.result_offset ?? 0,
      }),
    );
  },
};
