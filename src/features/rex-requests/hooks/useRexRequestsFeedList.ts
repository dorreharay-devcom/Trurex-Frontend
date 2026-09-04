import { useCallback, useMemo, useState } from 'react';
import { useRexRequestsFeed } from '~/features/rex-requests/hooks/useRexRequestsFeed';
import {
  audienceFiltersToCircleParams,
  type AudienceFilterId,
} from '~/features/discover/config/audienceFilters';
import type { CategoriesState } from '~/features/discover/hooks/useCategories';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';

type UseRexRequestsFeedListArgs = {
  enabled: boolean;
  categories: CategoriesState;
};

export function useRexRequestsFeedList({ enabled, categories }: UseRexRequestsFeedListArgs) {
  const [searchQuery, setSearchQuery] = useState('');
  const [circleFilter, setCircleFilter] = useState<AudienceFilterId[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const toggleCategory = useCallback((code: string) => {
    setCategoryFilter((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, DEFAULT_SEARCH_DEBOUNCE_MS);
  const circleFilterParams = audienceFiltersToCircleParams(circleFilter) ?? [];
  const categoryIds = useMemo(
    () =>
      categoryFilter.length
        ? categories.allCats
            .filter((cat) => categoryFilter.includes(cat.code))
            .map((cat) => cat.serverId)
            .filter((id): id is string => Boolean(id))
        : [],
    [categoryFilter, categories.allCats],
  );
  const feed = useRexRequestsFeed({
    enabled,
    search: debouncedSearchQuery,
    circleFilter: circleFilterParams,
    categoryIds,
  });

  return {
    searchQuery,
    setSearchQuery,
    circleFilter,
    setCircleFilter,
    categoryFilter,
    toggleCategory,
    feed,
    rows: feed.rows,
    hasItems: feed.rows.length > 0,
  };
}
