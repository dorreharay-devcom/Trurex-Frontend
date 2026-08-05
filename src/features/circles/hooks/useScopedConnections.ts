import { useState } from 'react';
import { CONNECTION_TAB } from '~/features/circles/config/connections';
import { useConnectionsByTab } from '~/features/circles/hooks/data/useConnections';
import { useConnectionSearch } from '~/features/circles/hooks/data/useConnectionSearch';
import { connectionListPhase } from '~/features/circles/lib/connectionPhase';
import type { ConnectionScopeTab } from '~/features/circles/types/connections';

type Args = {
  userId: string | undefined;
  enabled: boolean;
};

export type ScopedConnections = ReturnType<typeof useScopedConnections>;

export function useScopedConnections({ userId, enabled }: Args) {
  const [tab, setTab] = useState<ConnectionScopeTab>(CONNECTION_TAB.trusted);
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
