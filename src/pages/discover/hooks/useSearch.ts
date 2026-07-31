import { useMemo } from 'react';
import type { Recommendation } from '~/shared/types/recommendation';
import { useSearchRexes } from '~/pages/discover/hooks/useSearchRexes';
import type { SearchFiltersState } from '~/pages/discover/hooks/useSearchFilters';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/hooks/useDebouncedValue';

type UseSearchArgs = {
  searchQuery: string;
  activeCategory: string;
  filters: SearchFiltersState;
};

export function useSearch({ searchQuery, activeCategory, filters }: UseSearchArgs) {
  const hasSearch = searchQuery.trim().length > 0;
  const debouncedSearchQuery = useDebouncedValue(searchQuery, DEFAULT_SEARCH_DEBOUNCE_MS);
  const hasDebouncedSearch = debouncedSearchQuery.trim().length > 0;

  const { data, isLoading } = useSearchRexes(
    {
      searchTerm: debouncedSearchQuery,
      categoryId: activeCategory,
      searchCategoryFilter: filters.searchCategoryFilter,
      valueForMoneyFilters: filters.vfmFilter,
      qualityFilter: filters.qualityFilter,
      recencyFilterDays: filters.recencyFilterDays,
    },
    { enabled: hasDebouncedSearch },
  );

  const rows = useMemo((): Recommendation[] => {
    const list = data ?? [];
    if (filters.searchCategoryFilter.length > 1) {
      const selected = new Set(filters.searchCategoryFilter);
      return list.filter((r) => selected.has(r.categoryId));
    }
    return list;
  }, [data, filters.searchCategoryFilter]);

  return { hasSearch, rows, isLoading };
}
