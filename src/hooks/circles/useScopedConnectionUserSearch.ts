import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { searchUsers, type SearchUsersScope } from '~/api/usersApi';
import type { NetworkUserRow } from '~/types/network';
import { useDebouncedValue } from '~/hooks/useDebouncedValue';

export type ConnectionScopeTab = 'trusted' | 'followers' | 'following';

export const CONNECTION_TAB_SCOPE: Record<ConnectionScopeTab, SearchUsersScope> = {
  trusted: 'trusted',
  followers: 'followers',
  following: 'following',
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

export function useScopedConnectionUserSearch(
  tab: ConnectionScopeTab,
  subjectUserId: string | undefined,
  enabled: boolean,
) {
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebouncedValue(query, 320);
  const trimmedDebounced = debouncedSearch.trim();
  const searchActive = trimmedDebounced.length > 0;

  useEffect(() => {
    setQuery('');
  }, [tab]);

  const scope = CONNECTION_TAB_SCOPE[tab];

  const { data: searchRows = [], isFetching: searchFetching } = useQuery({
    queryKey: ['scopedConnectionUsers', scope, subjectUserId, trimmedDebounced],
    queryFn: () =>
      searchUsers({
        input_query: trimmedDebounced,
        input_scope: scope,
        input_user_id: subjectUserId ?? null,
      }),
    enabled: Boolean(enabled && subjectUserId && searchActive),
  });

  return {
    query,
    setQuery,
    debouncedSearch,
    searchRows,
    searchFetching,
    searchActive,
    placeholder: CONNECTION_TAB_PLACEHOLDER[tab],
  };
}
