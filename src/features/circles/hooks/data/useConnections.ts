import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  fetchTrustedUsers,
  fetchUserFollowers,
  fetchUserFollowing,
} from '~/features/circles/api/networkUsersApi';
import { CONNECTION_TAB } from '~/features/circles/config/connections';
import { CONNECTION_QUERY_KEY_BY_TAB } from '~/features/circles/config/queryKeys';
import type {
  ConnectionListState,
  ConnectionScopeTab,
  ConnectionsByTab,
} from '~/features/circles/types/connections';
import type { NetworkUserRow } from '~/features/circles/types/networkUser';
import { nextPageOffset } from '~/shared/lib/data/guards';

const CONNECTION_PAGE_LIMIT = 50;

type ConnectionFetcher = (
  subjectUserId: string,
  limit: number,
  offset: number,
) => Promise<NetworkUserRow[]>;

const CONNECTION_FETCHER_BY_TAB: Record<ConnectionScopeTab, ConnectionFetcher> = {
  trusted: fetchTrustedUsers,
  followers: fetchUserFollowers,
  following: fetchUserFollowing,
};

export function useConnectionUsers(
  tab: ConnectionScopeTab,
  subjectUserId: string | undefined,
  enabled: boolean,
): ConnectionListState {
  const query = useInfiniteQuery({
    queryKey: [CONNECTION_QUERY_KEY_BY_TAB[tab], subjectUserId, CONNECTION_PAGE_LIMIT],
    queryFn: ({ pageParam }) =>
      CONNECTION_FETCHER_BY_TAB[tab](subjectUserId!, CONNECTION_PAGE_LIMIT, Number(pageParam ?? 0)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      nextPageOffset(lastPage, allPages, CONNECTION_PAGE_LIMIT),
    enabled: Boolean(enabled && subjectUserId),
  });

  const rows = useMemo(() => query.data?.pages.flat() ?? [], [query.data?.pages]);

  const fetchNextPage = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    void query.fetchNextPage();
  }, [query]);

  return {
    rows,
    isInitialLoading: query.isLoading && rows.length === 0,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage,
  };
}

export function useConnectionsByTab(
  subjectUserId: string | undefined,
  enabled: boolean,
): ConnectionsByTab {
  return {
    trusted: useConnectionUsers(CONNECTION_TAB.trusted, subjectUserId, enabled),
    followers: useConnectionUsers(CONNECTION_TAB.followers, subjectUserId, enabled),
    following: useConnectionUsers(CONNECTION_TAB.following, subjectUserId, enabled),
  };
}
