import { useQuery } from '@tanstack/react-query';
import { DiscoveryApi, DiscoverQueryParams, SearchRexesParams } from '~/api/DiscoveryApi';
import { getRexCategoryApiCode } from '~/constants/recommendation/rexCategories';
import { Backend, unwrap } from '~/services/AuthService';
import { mapDiscoverFeedRowSafe } from '~/api/mapDiscoverFeed';
import type { Recommendation } from '~/types/recommendation/recommendation';

export type RecencyDayToken = 1 | 7 | 30 | 9999;

const VFM_ALL = [1, 2, 3, 4, 5] as const;

function recencyDaysToCreatedBounds(days: RecencyDayToken[]): {
  created_from: string | null;
  created_to: string | null;
} {
  if (days.length === 0) {
    return { created_from: null, created_to: null };
  }
  const concrete = days.filter((d) => d !== 9999) as (1 | 7 | 30)[];
  if (concrete.length === 0) {
    return { created_from: null, created_to: null };
  }
  const now = new Date();
  const to = now.toISOString();
  const startOfLocalDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const startMs = concrete.map((d) => {
    if (d === 1) return startOfLocalDay(now).getTime();
    if (d === 7) return now.getTime() - 7 * 24 * 60 * 60 * 1000;
    return now.getTime() - 30 * 24 * 60 * 60 * 1000;
  });
  const from = new Date(Math.min(...startMs));
  return { created_from: from.toISOString(), created_to: to };
}

function vfmForRpc(filters: number[]): number[] | null {
  if (filters.length === 0) {
    return null;
  }
  if (filters.length === 5 && VFM_ALL.every((n) => filters.includes(n))) {
    return null;
  }
  return [...new Set(filters)].filter((n) => n >= 1 && n <= 5).sort((a, b) => a - b);
}

type DiscoverRecommendationsOptions = {
  enabled?: boolean;
};

export const useDiscoverRecommendations = (
  params?: DiscoverQueryParams,
  options?: DiscoverRecommendationsOptions,
) => {
  return useQuery({
    queryKey: ['discover-recommendations', params],
    queryFn: () => DiscoveryApi.getDiscoverRecommendations(params),
    enabled: options?.enabled ?? true,
  });
};

type UseSearchRexesArgs = {
  searchTerm: string;
  categoryId: string;
  searchCategoryFilter: string[];
  valueForMoneyFilters: number[];
  recencyFilterDays: RecencyDayToken[];
} & Pick<SearchRexesParams, 'result_limit' | 'result_offset'>;

type UseSearchRexesOptions = {
  enabled?: boolean;
};

function effectiveCategoryFilter(
  categoryId: string,
  searchCategoryFilter: string[],
): string | null {
  if (searchCategoryFilter.length === 1) {
    return getRexCategoryApiCode(searchCategoryFilter[0]!);
  }
  if (searchCategoryFilter.length > 1) {
    return null;
  }
  if (categoryId === 'all') {
    return null;
  }
  return getRexCategoryApiCode(categoryId);
}

export const useSearchRexes = (args: UseSearchRexesArgs, options?: UseSearchRexesOptions) => {
  const trimmed = args.searchTerm.trim();
  const category_filter = effectiveCategoryFilter(args.categoryId, args.searchCategoryFilter);
  const { created_from, created_to } = recencyDaysToCreatedBounds(args.recencyFilterDays);
  const vfmRpc = vfmForRpc(args.valueForMoneyFilters);

  return useQuery({
    queryKey: [
      'search-rexes',
      trimmed,
      category_filter,
      [...args.searchCategoryFilter].sort().join(),
      [...args.valueForMoneyFilters].sort().join(),
      args.recencyFilterDays
        .slice()
        .sort((a, b) => a - b)
        .join(),
      created_from,
      created_to,
      args.result_limit ?? 20,
      args.result_offset ?? 0,
    ],
    queryFn: async () => {
      try {
        return await DiscoveryApi.searchRexes({
          search_term: trimmed || null,
          category_filter,
          value_for_money_filters: vfmRpc,
          created_from: created_from ?? null,
          created_to: created_to ?? null,
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

export const useMyRexes = (userId?: string) => {
  return useQuery<Recommendation[]>({
    queryKey: ['my-rexes', userId],
    queryFn: async () => {
      const raw = unwrap(await Backend.rpc('user_rexes', { input_user_id: userId, result_limit: 50, result_offset: 0 }));
      if (!Array.isArray(raw)) return [];
      return raw.flatMap((row) => {
        const rec = mapDiscoverFeedRowSafe(row);
        return rec ? [rec] : [];
      });
    },
    enabled: !!userId,
  });
};
