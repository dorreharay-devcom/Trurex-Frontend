import { useCallback, useMemo } from 'react';
import type { Recommendation } from '~/shared/types/recommendation';
import { useSearchRexes } from '~/features/discover/hooks/useSearchRexes';
import type { SearchFiltersState } from '~/features/discover/hooks/useSearchFilters';

type UseSearchArgs = {
  searchQuery: string;
  activeCategory: string;
  filters: SearchFiltersState;
};

export function useSearch({ searchQuery, activeCategory, filters }: UseSearchArgs) {
  const hasSearch = searchQuery.trim().length > 0;

  const {
    data,
    isLoading,
    isError,
    refetch: refetchQuery,
  } = useSearchRexes(
    {
      searchTerm: searchQuery,
      categoryId: activeCategory,
      searchCategoryFilter: filters.searchCategoryFilter,
      valueForMoneyFilters: filters.vfmFilter,
      qualityFilter: filters.qualityFilter,
      recencyFilterDays: filters.recencyFilterDays,
    },
    { enabled: hasSearch },
  );

  const rows = useMemo((): Recommendation[] => {
    const list = data ?? [];
    if (filters.searchCategoryFilter.length > 1) {
      const selected = new Set(filters.searchCategoryFilter);
      return list.filter((r) => selected.has(r.categoryId));
    }
    return list;
  }, [data, filters.searchCategoryFilter]);

  const refetch = useCallback(() => {
    void refetchQuery();
  }, [refetchQuery]);

  return {
    hasSearch,
    rows,
    isLoading,
    isError: isError && rows.length === 0,
    refetch,
  };
}
