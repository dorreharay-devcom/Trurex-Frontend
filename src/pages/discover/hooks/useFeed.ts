import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DiscoveryApi } from '~/pages/discover/api/DiscoveryApi';
import { ALL_CATEGORIES } from '~/pages/discover/types';
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

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
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
    fetchNextPage();
  }, [enabled, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

  return { rows, isLoading, loadMore, isFetchingNextPage };
}
