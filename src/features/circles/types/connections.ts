import type { NetworkUserRow } from '~/types/network';

export type ConnectionScopeTab = 'trusted' | 'followers' | 'following';

export type ConnectionListState = {
  rows: NetworkUserRow[];
  isInitialLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export type ConnectionsByTab = Record<ConnectionScopeTab, ConnectionListState>;

export type ConnectionListPhase =
  | 'loading'
  | 'rows'
  | 'no_match'
  | 'trusted_empty'
  | 'followers_empty'
  | 'following_empty';
