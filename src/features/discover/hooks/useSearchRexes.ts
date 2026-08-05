import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { DiscoveryApi } from '~/features/discover/api/DiscoveryApi';
import type { SearchRexesParams } from '~/features/discover/api/types';
import {
  effectiveCategoryFilter,
  recencyDaysToCreatedBounds,
  vfmForRpc,
  type RecencyDayToken,
} from '~/features/discover/lib/searchParams';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

const SEARCH_PAGE_SIZE = 20;

type UseSearchRexesArgs = {
  searchTerm: string;
  categoryId: string;
  searchCategoryFilter: string[];
  valueForMoneyFilters: number[];
  qualityFilter: number | null;
  recencyFilterDays: RecencyDayToken[];
} & Pick<SearchRexesParams, 'result_limit' | 'result_offset'>;

type UseSearchRexesOptions = {
  enabled?: boolean;
};

function parseRecencyKey(key: string): RecencyDayToken[] {
  return key
    .split(',')
    .filter(Boolean)
    .map((d) => Number(d) as RecencyDayToken);
}

export const useSearchRexes = (args: UseSearchRexesArgs, options?: UseSearchRexesOptions) => {
  const trimmed = args.searchTerm.trim();
  const categoryFilter = effectiveCategoryFilter(args.categoryId, args.searchCategoryFilter);
  const vfmRpc = vfmForRpc(args.valueForMoneyFilters);
  const resultLimit = args.result_limit ?? SEARCH_PAGE_SIZE;
  const resultOffset = args.result_offset ?? 0;

  const recencyKey = [...args.recencyFilterDays].sort((a, b) => a - b).join(',');
  const { created_from, created_to } = useMemo(
    () => recencyDaysToCreatedBounds(parseRecencyKey(recencyKey)),
    [recencyKey],
  );

  return useQuery({
    queryKey: [
      ...REX_QUERY_KEYS.searchRexes,
      trimmed,
      categoryFilter,
      [...args.searchCategoryFilter].sort().join(','),
      [...args.valueForMoneyFilters].sort().join(','),
      args.qualityFilter ?? 'none',
      recencyKey,
      created_from,
      created_to,
      resultLimit,
      resultOffset,
    ],
    queryFn: () =>
      DiscoveryApi.searchRexes({
        search_term: trimmed || null,
        category_filter: categoryFilter,
        value_for_money_filters: vfmRpc,
        quality_filter: args.qualityFilter,
        created_from,
        created_to,
        result_limit: resultLimit,
        result_offset: resultOffset,
      }),
    enabled: (options?.enabled ?? true) && trimmed.length > 0,
  });
};
