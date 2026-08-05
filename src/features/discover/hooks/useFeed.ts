import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DiscoveryApi } from '~/features/discover/api/DiscoveryApi';
import { ALL_CATEGORIES } from '~/features/discover/types';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

export const FEED_QUERY_KEY = REX_QUERY_KEYS.discoverFeed[0];

const FEED_PAGE_SIZE = 20;

type UseFeedArgs = {
  activeCategory: string;
  activeTag: string | null;
  enabled: boolean;
};

export function useFeed({ activeCategory, activeTag, enabled }: UseFeedArgs) {
  const categoryFilter = activeCategory !== ALL_CATEGORIES ? activeCategory : null;
  const tagFilters = activeTag ? [activeTag] : null;

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
      FEED_QUERY_KEY,
      categoryFilter,
      [...(tagFilters ?? [])].sort().join(','),
      FEED_PAGE_SIZE,
    ],
    queryFn: ({ pageParam }) =>
      DiscoveryApi.getDiscoverRecommendations({
        category_filter: categoryFilter,
        tag_filters: tagFilters,
        result_limit: FEED_PAGE_SIZE,
        result_offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      return allPages.length * FEED_PAGE_SIZE;
    },
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
