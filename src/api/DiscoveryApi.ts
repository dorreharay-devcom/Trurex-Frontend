import { Backend, unwrap } from '~/services/AuthService';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { mapDiscoverFeedRowSafe } from '~/api/mapDiscoverFeed';

export interface DiscoverQueryParams {
  result_limit?: number;
  result_offset?: number;
}

export interface SearchRexesParams {
  search_term?: string | null;
  category_filter?: string | null;
  value_for_money_filters?: number[] | null;
  created_from?: string | null;
  created_to?: string | null;
  result_limit?: number;
  result_offset?: number;
}

export const DiscoveryApi = {
  getDiscoverRecommendations: async (
    params: DiscoverQueryParams = {},
  ): Promise<Recommendation[]> => {
    const raw = unwrap(
      await Backend.rpc('recommendation_feed', {
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

  searchRexes: async (params: SearchRexesParams): Promise<Recommendation[]> => {
    const raw = unwrap(
      await Backend.rpc('search_rexes', {
        search_term: params.search_term ?? null,
        category_filter: params.category_filter ?? null,
        value_for_money_filters: params.value_for_money_filters?.length
          ? params.value_for_money_filters
          : null,
        created_from: params.created_from ?? null,
        created_to: params.created_to ?? null,
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
