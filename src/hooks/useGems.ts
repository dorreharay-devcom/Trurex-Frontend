import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { GemsApi, SavedRexesParams } from '~/api/GemsApi';

const SAVED_REXES_PAGE_LIMIT = 20;

export const useSavedRexes = (params: SavedRexesParams = {}) => {
  const pageSize = params.result_limit ?? SAVED_REXES_PAGE_LIMIT;
  const searchTerm = params.search_term?.trim() || null;

  const query = useInfiniteQuery({
    queryKey: ['my-saved-rexes', pageSize, searchTerm, params.uncollected === true],
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
