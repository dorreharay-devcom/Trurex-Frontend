import { CONNECTION_PHASE } from '~/features/circles/config/connections';
import type {
  ConnectionListPhase,
  ConnectionListState,
  ConnectionScopeTab,
} from '~/features/circles/types/connections';
import type { NetworkUserRow } from '~/features/circles/types/networkUser';

const EMPTY_PHASE_BY_TAB: Record<ConnectionScopeTab, ConnectionListPhase> = {
  trusted: CONNECTION_PHASE.trustedEmpty,
  followers: CONNECTION_PHASE.followersEmpty,
  following: CONNECTION_PHASE.followingEmpty,
};

type PhaseArgs = {
  tab: ConnectionScopeTab;
  searchActive: boolean;
  searchRows: NetworkUserRow[];
  searchFetching: boolean;
  searchError: boolean;
  fallback: Pick<ConnectionListState, 'rows' | 'isInitialLoading' | 'isError'>;
};

export function connectionListPhase(args: PhaseArgs): ConnectionListPhase {
  const { tab, searchActive, searchRows, searchFetching, searchError, fallback } = args;

  if (searchActive && searchFetching && searchRows.length === 0) return CONNECTION_PHASE.loading;
  if (searchActive && searchError && searchRows.length === 0) return CONNECTION_PHASE.error;
  if (searchActive && searchRows.length === 0) return CONNECTION_PHASE.noMatch;
  if (searchActive) return CONNECTION_PHASE.rows;

  if (fallback.isInitialLoading) return CONNECTION_PHASE.loading;
  if (fallback.isError && fallback.rows.length === 0) return CONNECTION_PHASE.error;
  if (fallback.rows.length === 0) return EMPTY_PHASE_BY_TAB[tab];
  return CONNECTION_PHASE.rows;
}
