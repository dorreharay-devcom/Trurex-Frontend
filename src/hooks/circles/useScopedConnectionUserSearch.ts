import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchTrustedUsers,
  fetchUserFollowers,
  fetchUserFollowing,
  searchUsers,
  type SearchUsersScope,
} from '~/api/usersApi';
import type { NetworkUserRow } from '~/types/network';
import { useDebouncedValue } from '~/hooks/useDebouncedValue';

const CONNECTION_PAGE_LIMIT = 50;
const SEARCH_PAGE_LIMIT = 20;

export type ConnectionScopeTab = 'trusted' | 'followers' | 'following';

export const CONNECTION_TAB_SCOPE: Record<ConnectionScopeTab, SearchUsersScope> = {
  trusted: 'trusted',
  followers: 'followers',
  following: 'following',
};

const CONNECTION_TAB_QUERY_KEY: Record<ConnectionScopeTab, string> = {
  trusted: 'trusted_users',
  followers: 'user_followers',
  following: 'user_following',
};

export const CONNECTION_TAB_PLACEHOLDER: Record<ConnectionScopeTab, string> = {
  trusted: 'Search trusted...',
  followers: 'Search followers...',
  following: 'Search following...',
};

export type ScopedConnectionListPhase =
  | 'loading'
  | 'rows'
  | 'no_match'
  | 'trusted_empty'
  | 'followers_empty'
  | 'following_empty';

export function scopedConnectionListPhase(args: {
  tab: ConnectionScopeTab;
  searchActive: boolean;
  searchRows: NetworkUserRow[];
  searchFetching: boolean;
  fallbackRows: NetworkUserRow[];
  fallbackLoading: boolean;
}): ScopedConnectionListPhase {
  const { tab, searchActive, searchRows, searchFetching, fallbackRows, fallbackLoading } = args;

  if (searchActive) {
    if (searchFetching && searchRows.length === 0) return 'loading';
    if (searchRows.length > 0) return 'rows';
    return 'no_match';
  }

  if (fallbackLoading && fallbackRows.length === 0) return 'loading';
  if (fallbackRows.length > 0) return 'rows';
  if (tab === 'trusted') return 'trusted_empty';
  if (tab === 'followers') return 'followers_empty';
  return 'following_empty';
}

export function connectionRowsForDisplay(args: {
  searchActive: boolean;
  searchRows: NetworkUserRow[];
  fallbackRows: NetworkUserRow[];
}): NetworkUserRow[] {
  return args.searchActive ? args.searchRows : args.fallbackRows;
}

export type ConnectionFallbackVmSlice = {
  trustedRows: NetworkUserRow[];
  followerRows: NetworkUserRow[];
  followingRows: NetworkUserRow[];
  trustedLoading: boolean;
  followersLoading: boolean;
  followingLoading: boolean;
};

export type ConnectionFallbackPaginationVmSlice = ConnectionFallbackVmSlice & {
  trustedHasNextPage: boolean;
  followersHasNextPage: boolean;
  followingHasNextPage: boolean;
  trustedFetchingNextPage: boolean;
  followersFetchingNextPage: boolean;
  followingFetchingNextPage: boolean;
  fetchNextTrustedPage: () => void;
  fetchNextFollowersPage: () => void;
  fetchNextFollowingPage: () => void;
};

export function connectionFallbackRows(
  tab: ConnectionScopeTab,
  vm: ConnectionFallbackVmSlice,
): NetworkUserRow[] {
  switch (tab) {
    case 'trusted':
      return vm.trustedRows;
    case 'followers':
      return vm.followerRows;
    case 'following':
      return vm.followingRows;
  }
}

export function connectionFallbackInitialLoading(
  tab: ConnectionScopeTab,
  vm: ConnectionFallbackVmSlice,
): boolean {
  switch (tab) {
    case 'trusted':
      return vm.trustedLoading && vm.trustedRows.length === 0;
    case 'followers':
      return vm.followersLoading && vm.followerRows.length === 0;
    case 'following':
      return vm.followingLoading && vm.followingRows.length === 0;
  }
}

export function connectionFallbackHasNextPage(
  tab: ConnectionScopeTab,
  vm: ConnectionFallbackPaginationVmSlice,
): boolean {
  switch (tab) {
    case 'trusted':
      return vm.trustedHasNextPage;
    case 'followers':
      return vm.followersHasNextPage;
    case 'following':
      return vm.followingHasNextPage;
  }
}

export function connectionFallbackFetchingNextPage(
  tab: ConnectionScopeTab,
  vm: ConnectionFallbackPaginationVmSlice,
): boolean {
  switch (tab) {
    case 'trusted':
      return vm.trustedFetchingNextPage;
    case 'followers':
      return vm.followersFetchingNextPage;
    case 'following':
      return vm.followingFetchingNextPage;
  }
}

export function connectionFallbackFetchNextPage(
  tab: ConnectionScopeTab,
  vm: ConnectionFallbackPaginationVmSlice,
): () => void {
  switch (tab) {
    case 'trusted':
      return vm.fetchNextTrustedPage;
    case 'followers':
      return vm.fetchNextFollowersPage;
    case 'following':
      return vm.fetchNextFollowingPage;
  }
}

export function connectionCountLabel(count: number, hasNextPage: boolean): string {
  return hasNextPage ? `${count}+` : String(count);
}

async function fetchConnectionPage(
  tab: ConnectionScopeTab,
  subjectUserId: string,
  offset: number,
): Promise<NetworkUserRow[]> {
  switch (tab) {
    case 'trusted':
      return fetchTrustedUsers(subjectUserId, CONNECTION_PAGE_LIMIT, offset);
    case 'followers':
      return fetchUserFollowers(subjectUserId, CONNECTION_PAGE_LIMIT, offset);
    case 'following':
      return fetchUserFollowing(subjectUserId, CONNECTION_PAGE_LIMIT, offset);
  }
}

export function useConnectionUsers(
  tab: ConnectionScopeTab,
  subjectUserId: string | undefined,
  enabled: boolean,
) {
  const queryKeyRoot = CONNECTION_TAB_QUERY_KEY[tab];

  const query = useInfiniteQuery({
    queryKey: [queryKeyRoot, subjectUserId, CONNECTION_PAGE_LIMIT],
    queryFn: ({ pageParam }) => fetchConnectionPage(tab, subjectUserId!, Number(pageParam ?? 0)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === CONNECTION_PAGE_LIMIT
        ? allPages.length * CONNECTION_PAGE_LIMIT
        : undefined,
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

export function useScopedConnectionUserSearch(
  tab: ConnectionScopeTab,
  subjectUserId: string | undefined,
  enabled: boolean,
) {
  const [searchQuery, setQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 320);
  const trimmedDebounced = debouncedSearch.trim();
  const searchActive = trimmedDebounced.length > 0;

  useEffect(() => {
    setQuery('');
  }, [tab]);

  const scope = CONNECTION_TAB_SCOPE[tab];

  const searchQueryResult = useInfiniteQuery({
    queryKey: ['scopedConnectionUsers', scope, subjectUserId, trimmedDebounced],
    queryFn: ({ pageParam }) =>
      searchUsers({
        input_query: trimmedDebounced,
        input_limit: SEARCH_PAGE_LIMIT,
        input_offset: Number(pageParam ?? 0),
        input_scope: scope,
        input_user_id: subjectUserId ?? null,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === SEARCH_PAGE_LIMIT ? allPages.length * SEARCH_PAGE_LIMIT : undefined,
    enabled: Boolean(enabled && subjectUserId && searchActive),
  });

  const searchRows = useMemo(
    () => searchQueryResult.data?.pages.flat() ?? [],
    [searchQueryResult.data?.pages],
  );

  const fetchNextSearchPage = useCallback(() => {
    if (!searchQueryResult.hasNextPage || searchQueryResult.isFetchingNextPage) return;
    void searchQueryResult.fetchNextPage();
  }, [searchQueryResult]);

  return {
    query: searchQuery,
    setQuery,
    debouncedSearch,
    searchRows,
    searchFetching: searchQueryResult.isFetching,
    searchHasNextPage: Boolean(searchQueryResult.hasNextPage),
    searchFetchingNextPage: searchQueryResult.isFetchingNextPage,
    fetchNextSearchPage,
    searchActive,
    placeholder: CONNECTION_TAB_PLACEHOLDER[tab],
  };
}
