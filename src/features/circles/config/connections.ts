import type { SearchUsersScope } from '~/features/circles/types/networkUser';
import type { ConnectionListPhase, ConnectionScopeTab } from '~/features/circles/types/connections';

export const CONNECTION_TAB = {
  trusted: 'trusted',
  followers: 'followers',
  following: 'following',
} as const satisfies Record<string, ConnectionScopeTab>;

export const CONNECTION_PHASE = {
  loading: 'loading',
  rows: 'rows',
  error: 'error',
  noMatch: 'no_match',
  trustedEmpty: 'trusted_empty',
  followersEmpty: 'followers_empty',
  followingEmpty: 'following_empty',
} as const satisfies Record<string, ConnectionListPhase>;

export const CONNECTION_TAB_LABEL: Record<ConnectionScopeTab, string> = {
  trusted: 'Trusted',
  followers: 'Followers',
  following: 'Following',
};

export const CONNECTION_TAB_PLACEHOLDER: Record<ConnectionScopeTab, string> = {
  trusted: 'Search trusted...',
  followers: 'Search followers...',
  following: 'Search following...',
};

export const CONNECTION_TAB_SCOPE: Record<ConnectionScopeTab, SearchUsersScope> = {
  trusted: 'trusted',
  followers: 'followers',
  following: 'following',
};
