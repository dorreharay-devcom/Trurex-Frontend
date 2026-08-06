import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CONNECTION_TAB } from '~/features/circles/config/connections';
import { useConnectionsByTab } from '~/features/circles/hooks/data/useConnections';
import { useConnectionSearch } from '~/features/circles/hooks/data/useConnectionSearch';
import { connectionListPhase } from '~/features/circles/lib/connectionPhase';
import type { ConnectionScopeTab } from '~/features/circles/types/connections';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';

const SCOPE_VALUES = new Set<string>(Object.values(CONNECTION_TAB));

function parseScopeParam(value: string | undefined): ConnectionScopeTab {
  if (value && SCOPE_VALUES.has(value)) return value as ConnectionScopeTab;
  return CONNECTION_TAB.trusted;
}

type Args = {
  userId: string | undefined;
  enabled: boolean;
};

export type ScopedConnections = ReturnType<typeof useScopedConnections>;

export function useScopedConnections({ userId, enabled }: Args) {
  const router = useRouter();
  const raw = useLocalSearchParams<{ scope?: string | string[] }>();
  const tab = useMemo(() => parseScopeParam(firstRouteParam(raw.scope)), [raw.scope]);

  const setTab = useCallback(
    (next: ConnectionScopeTab) => {
      router.setParams({ scope: next });
    },
    [router],
  );

  const byTab = useConnectionsByTab(userId, enabled);
  const search = useConnectionSearch(tab, userId, enabled);

  const fallback = byTab[tab];
  const source = search.active ? search : fallback;

  const phase = connectionListPhase({
    tab,
    searchActive: search.active,
    searchRows: search.rows,
    searchFetching: search.isFetching,
    searchError: search.isError,
    fallback,
  });

  return {
    tab,
    setTab,
    byTab,
    phase,
    rows: source.rows,
    hasNextPage: source.hasNextPage,
    isFetchingNextPage: source.isFetchingNextPage,
    isFetchNextPageError: source.isFetchNextPageError,
    fetchNextPage: source.fetchNextPage,
    retry: source.retry,
    search: {
      value: search.query,
      onChangeText: search.setQuery,
      placeholder: search.placeholder,
    },
  };
}
