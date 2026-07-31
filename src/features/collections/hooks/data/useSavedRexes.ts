import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { GemsApi } from '~/features/collections/api/gemsApi';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import type { SavedRexesParams } from '~/features/collections/types/savedRexes';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/hooks/useDebouncedValue';

const SAVED_REXES_PAGE_LIMIT = 20;

export const useSavedRexes = (params: SavedRexesParams = {}) => {
  const pageSize = params.result_limit ?? SAVED_REXES_PAGE_LIMIT;
  const rawSearchTerm = params.search_term?.trim() || '';
  const debouncedRawSearchTerm = useDebouncedValue(rawSearchTerm, DEFAULT_SEARCH_DEBOUNCE_MS);
  const searchTerm = debouncedRawSearchTerm.trim() || null;

  const query = useInfiniteQuery({
    queryKey: [
      ...COLLECTIONS_QUERY_KEYS.mySavedRexes,
      pageSize,
      searchTerm,
      Boolean(params.uncollected),
    ],
    queryFn: ({ pageParam }) =>
      GemsApi.getSavedRexes({
        ...params,
        result_limit: pageSize,
        result_offset: Number(pageParam ?? 0),
        search_term: searchTerm,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === pageSize ? allPages.length * pageSize : undefined,
  });

  const rows = useMemo(() => query.data?.pages.flat() ?? [], [query.data?.pages]);
  const fetchNextPage = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    void query.fetchNextPage();
  }, [query]);

  return {
    ...query,
    data: rows,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage,
  };
};
