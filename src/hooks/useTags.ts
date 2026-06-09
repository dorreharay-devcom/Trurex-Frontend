import { useQuery } from '@tanstack/react-query';
import { TagsApi, type TagRow } from '~/api/TagsApi';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/hooks/useDebouncedValue';

export const useTrendingTags = () => {
  return useQuery<TagRow[]>({
    queryKey: ['tags', 'trending'],
    queryFn: () => TagsApi.trendingNow(),
    staleTime: 5 * 60_000,
  });
};

export const useSearchTags = (searchTerm: string, limit = 20) => {
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), DEFAULT_SEARCH_DEBOUNCE_MS);
  return useQuery<TagRow[]>({
    queryKey: ['tags', 'search', debouncedSearchTerm, limit],
    queryFn: () => TagsApi.search(debouncedSearchTerm, limit),
    enabled: debouncedSearchTerm.length > 0,
    staleTime: 30_000,
  });
};
