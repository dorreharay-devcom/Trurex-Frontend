import { useQuery } from '@tanstack/react-query';
import { DiscoveryApi, DiscoverQueryParams, SearchRexesParams } from '~/api/DiscoveryApi';
import { getRexCategoryApiCode } from '~/constants/recommendation/rexCategories';
import { recommendations as mockRecommendations } from '~/data/mockData';

type DiscoverRecommendationsOptions = {
  enabled?: boolean;
};

export const useDiscoverRecommendations = (
  params?: DiscoverQueryParams,
  options?: DiscoverRecommendationsOptions,
) => {
  return useQuery({
    queryKey: ['discover-recommendations', params],
    queryFn: async () => {
      try {
        const data = await DiscoveryApi.getDiscoverRecommendations(params);
        if (!data || data.length === 0) {
          return mockRecommendations;
        }
        return data;
      } catch (error) {
        console.warn('Discovery API error, falling back to mock data:', error);
        return mockRecommendations;
      }
    },
    enabled: options?.enabled ?? true,
  });
};

type UseSearchRexesArgs = Omit<SearchRexesParams, 'search_term' | 'category_filter'> & {
  searchTerm: string;
  categoryId: string;
};

type UseSearchRexesOptions = {
  enabled?: boolean;
};

export const useSearchRexes = (args: UseSearchRexesArgs, options?: UseSearchRexesOptions) => {
  const trimmed = args.searchTerm.trim();
  const category_filter = args.categoryId === 'all' ? null : getRexCategoryApiCode(args.categoryId);

  return useQuery({
    queryKey: [
      'search-rexes',
      trimmed,
      category_filter,
      args.result_limit ?? 20,
      args.result_offset ?? 0,
    ],
    queryFn: async () => {
      try {
        return await DiscoveryApi.searchRexes({
          search_term: trimmed || null,
          category_filter,
          result_limit: args.result_limit ?? 20,
          result_offset: args.result_offset ?? 0,
        });
      } catch (error) {
        console.warn('search_rexes error:', error);
        return [];
      }
    },
    enabled: (options?.enabled ?? true) && trimmed.length > 0,
  });
};
