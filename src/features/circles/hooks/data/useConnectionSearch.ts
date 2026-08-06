import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { searchUsers } from '~/features/circles/api/networkUsersApi';
import {
  CONNECTION_TAB_PLACEHOLDER,
  CONNECTION_TAB_SCOPE,
} from '~/features/circles/config/connections';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';
import type { ConnectionScopeTab } from '~/features/circles/types/connections';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';
import { nextPageOffset } from '~/shared/lib/data/guards';

const SEARCH_PAGE_LIMIT = 20;

export function useConnectionSearch(
  tab: ConnectionScopeTab,
  subjectUserId: string | undefined,
  enabled: boolean,
) {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, DEFAULT_SEARCH_DEBOUNCE_MS).trim();
  const active = debounced.length > 0;

  useEffect(() => {
    setQuery('');
  }, [tab]);

  const scope = CONNECTION_TAB_SCOPE[tab];

  const result = useInfiniteQuery({
    queryKey: [CIRCLES_QUERY_KEYS.connectionSearch, scope, subjectUserId, debounced],
    queryFn: ({ pageParam }) =>
      searchUsers({
        input_query: debounced,
        input_limit: SEARCH_PAGE_LIMIT,
        input_offset: Number(pageParam ?? 0),
        input_scope: scope,
        input_user_id: subjectUserId ?? null,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => nextPageOffset(lastPage, allPages, SEARCH_PAGE_LIMIT),
    enabled: Boolean(enabled && subjectUserId && active),
  });

  const rows = useMemo(() => result.data?.pages.flat() ?? [], [result.data?.pages]);

  const fetchNextPage = useCallback(() => {
    if (!result.hasNextPage || result.isFetchingNextPage) return;
    void result.fetchNextPage();
  }, [result]);

  return {
    query,
    setQuery,
    placeholder: CONNECTION_TAB_PLACEHOLDER[tab],
    active,
    rows,
    isFetching: result.isFetching,
    isError: result.isError && rows.length === 0,
    hasNextPage: Boolean(result.hasNextPage),
    isFetchingNextPage: result.isFetchingNextPage,
    isFetchNextPageError: result.isFetchNextPageError,
    fetchNextPage,
    retry: () => void result.refetch(),
  };
}
