import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchPlacesForRex } from '~/features/rex-create/api/rexPlacesApi';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/hooks/useDebouncedValue';
import type { CreateRecSearchPlace } from '~/features/rex-create/types/create';
import { mapSearchResponseToPlaces } from '~/features/rex-create/lib/place';

const DEFAULT_MIN_QUERY_LENGTH = 1;
const STALE_TIME_MS = 30_000;
const QUERY_KEY_ROOT = 'rexPlaceSearch' as const;

export type UseRexPlaceSearchOptions = {
  searchQuery: string;
  enabled: boolean;
  debounceMs?: number;
  minQueryLength?: number;
};

export type UseRexPlaceSearchResult = {
  results: CreateRecSearchPlace[];
  canSearch: boolean;
  isSearching: boolean;
  showNoResults: boolean;
  searchErrorMessage: string | null;
};

export function useRexPlaceSearch({
  searchQuery,
  enabled,
  debounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
  minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
}: UseRexPlaceSearchOptions): UseRexPlaceSearchResult {
  const debouncedRaw = useDebouncedValue(searchQuery, debounceMs);
  const debouncedQuery = debouncedRaw.trim();
  const canSearch = debouncedQuery.length >= minQueryLength;

  const { data, isFetching, isError, error } = useQuery({
    queryKey: [QUERY_KEY_ROOT, debouncedQuery],
    queryFn: () => searchPlacesForRex({ input: debouncedQuery }),
    enabled: enabled && canSearch,
    staleTime: STALE_TIME_MS,
  });

  const results = useMemo(() => {
    if (!data?.results?.length) return [];
    return mapSearchResponseToPlaces(data.results);
  }, [data?.results]);

  const showNoResults = useMemo(() => {
    if (!canSearch || isFetching) return false;
    return results.length === 0;
  }, [canSearch, isFetching, results.length]);

  const searchErrorMessage = useMemo(
    () => (isError ? ((error as Error)?.message ?? 'Search failed. Try again.') : null),
    [isError, error],
  );

  return {
    results,
    canSearch,
    isSearching: isFetching,
    showNoResults,
    searchErrorMessage,
  };
}
