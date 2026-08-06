import type { NetworkUserRow } from '~/features/circles/types/networkUser';

export type ConnectionScopeTab = 'trusted' | 'followers' | 'following';

export type ConnectionListState = {
  rows: NetworkUserRow[];
  isInitialLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => void;
  retry: () => void;
};

export type ConnectionsByTab = Record<ConnectionScopeTab, ConnectionListState>;

export type ConnectionListPhase =
  | 'loading'
  | 'rows'
  | 'error'
  | 'no_match'
  | 'trusted_empty'
  | 'followers_empty'
  | 'following_empty';
