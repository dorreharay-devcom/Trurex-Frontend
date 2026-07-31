import { CIRCLE_QUERY_KEYS } from '~/shared/config/queryKeys';
import type { ConnectionScopeTab } from '~/features/circles/types/connections';

export const CIRCLES_QUERY_KEYS = {
  myCircles: CIRCLE_QUERY_KEYS.myCircles,
  circleMembers: 'circleMembers',
  peopleSuggestions: ['people_suggestions'],
  connectionSearch: 'scopedConnectionUsers',
  profileShare: 'profileShare',
} as const;

export const CONNECTION_QUERY_KEY_BY_TAB: Record<ConnectionScopeTab, string> = {
  trusted: 'trusted_users',
  followers: 'user_followers',
  following: 'user_following',
};

export const CONNECTION_DEPENDENT_QUERY_KEYS = [
  [CONNECTION_QUERY_KEY_BY_TAB.trusted],
  [CONNECTION_QUERY_KEY_BY_TAB.followers],
  [CONNECTION_QUERY_KEY_BY_TAB.following],
] as const;
