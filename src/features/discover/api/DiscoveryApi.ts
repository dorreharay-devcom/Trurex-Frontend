import { Backend, unwrap } from '~/shared/api/client';
import type { Recommendation } from '~/shared/types/recommendation';
import { mapApiRowToRecommendation } from '~/shared/lib/recommendation';
import type {
  DiscoverCollectionRow,
  DiscoverCollectionsFeedParams,
  DiscoverQueryParams,
  SearchRexesParams,
} from './types';

export const DiscoveryApi = {
  getDiscoverRecommendations: async (
    params: DiscoverQueryParams = {},
  ): Promise<Recommendation[]> => {
    const raw = unwrap(
      await Backend.rpc('recommendation_feed', {
        category_filter: params.category_filter ?? null,
        tag_filters: params.tag_filters?.length ? params.tag_filters : null,
        result_limit: params.result_limit ?? 20,
        result_offset: params.result_offset ?? 0,
      }),
    );
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((row) => {
      const rec = mapApiRowToRecommendation(row);
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
        quality_filter:
          params.quality_filter != null && params.quality_filter >= 1 && params.quality_filter <= 5
            ? params.quality_filter
            : null,
        created_from: params.created_from ?? null,
        created_to: params.created_to ?? null,
        result_limit: params.result_limit ?? 20,
        result_offset: params.result_offset ?? 0,
      }),
    );
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((row) => {
      const rec = mapApiRowToRecommendation(row);
      return rec ? [rec] : [];
    });
  },

  discoverCollectionsFeed: async (
    params: DiscoverCollectionsFeedParams = {},
  ): Promise<DiscoverCollectionRow[]> => {
    const raw = unwrap(
      await Backend.rpc('discover_collections_feed', {
        result_limit: params.result_limit ?? 50,
        result_offset: params.result_offset ?? 0,
        search_query: params.search_query ?? null,
      }),
    );
    return Array.isArray(raw) ? (raw as DiscoverCollectionRow[]) : [];
  },
};
