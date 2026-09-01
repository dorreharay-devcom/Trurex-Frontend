import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DiscoveryApi } from '~/features/discover/api/DiscoveryApi';
import type { DiscoverCollectionRow } from '~/features/discover/api/types';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

const COLLECTIONS_FEED_PAGE_SIZE = 20;

function nextCollectionsFeedOffset(
  lastPage: DiscoverCollectionRow[],
  allPages: DiscoverCollectionRow[][],
): number | undefined {
  const nextOffset = allPages.length * COLLECTIONS_FEED_PAGE_SIZE;
  const totalCount = lastPage[0]?.total_count;
  if (totalCount != null) return nextOffset < totalCount ? nextOffset : undefined;
  return lastPage.length === COLLECTIONS_FEED_PAGE_SIZE ? nextOffset : undefined;
}

type UseDiscoverCollectionsFeedArgs = {
  enabled: boolean;
  searchQuery?: string;
};

export function useDiscoverCollectionsFeed({
  enabled,
  searchQuery = '',
}: UseDiscoverCollectionsFeedArgs) {
  const trimmedSearchQuery = searchQuery.trim();
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
      ...REX_QUERY_KEYS.discoverCollectionsFeed,
      COLLECTIONS_FEED_PAGE_SIZE,
      trimmedSearchQuery.toLowerCase(),
    ],
    queryFn: ({ pageParam }) =>
      DiscoveryApi.discoverCollectionsFeed({
        result_limit: COLLECTIONS_FEED_PAGE_SIZE,
        result_offset: pageParam,
        search_query: trimmedSearchQuery || null,
      }),
    initialPageParam: 0,
    getNextPageParam: nextCollectionsFeedOffset,
    enabled,
  });

  const rows = useMemo(() => data?.pages.flat() ?? [], [data]);

  const loadMore = useCallback(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage || isLoading) {
      return;
    }
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
