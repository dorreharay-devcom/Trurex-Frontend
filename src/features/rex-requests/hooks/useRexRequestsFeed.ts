import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRexRequestsFeed } from '~/features/rex-requests/api/rexRequestsApi';
import type { RexRequestRow } from '~/features/rex-requests/api/types';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';
import { nextPageOffset } from '~/shared/lib/data/guards';

const REX_REQUESTS_FEED_PAGE_SIZE = 20;

type UseRexRequestsFeedArgs = {
  enabled: boolean;
  search?: string;
  circleFilter?: readonly string[];
  categoryIds?: readonly string[];
};

export function useRexRequestsFeed({
  enabled,
  search = '',
  circleFilter = [],
  categoryIds = [],
}: UseRexRequestsFeedArgs) {
  const {
    data,
    isLoading,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchQuery,
  } = useInfiniteQuery({
    queryKey: [
      ...REX_REQUEST_QUERY_KEYS.feed,
      REX_REQUESTS_FEED_PAGE_SIZE,
      search.trim().toLowerCase(),
      [...circleFilter].sort().join(','),
      [...categoryIds].sort().join(','),
    ],
    queryFn: ({ pageParam }) =>
      getRexRequestsFeed({
        resultLimit: REX_REQUESTS_FEED_PAGE_SIZE,
        resultOffset: pageParam,
        search: search.trim() || null,
        circleFilter: circleFilter.length ? [...circleFilter] : null,
        categoryIds: categoryIds.length ? [...categoryIds] : null,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: RexRequestRow[], allPages: RexRequestRow[][]) =>
      nextPageOffset(lastPage, allPages, REX_REQUESTS_FEED_PAGE_SIZE),
    enabled,
  });

  const rows = useMemo(() => data?.pages.flat() ?? [], [data]);

  const loadMore = useCallback(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage || isLoading) return;
    void fetchNextPage();
  }, [enabled, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const refetch = useCallback(() => {
    void refetchQuery();
  }, [refetchQuery]);

  const retryNextPage = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  return {
    rows,
    isLoading,
    isError: isError && rows.length === 0,
    isFetchNextPageError,
    loadMore,
    isFetchingNextPage,
    refetch,
    retryNextPage,
  };
}
