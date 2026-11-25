import {
  ACCOUNT_MODE_QUERY_KEY_ROOT,
  BUSINESS_PROFILE_QUERY_KEY_ROOT,
  MY_PROFILES_QUERY_KEY_ROOT,
} from '~/shared/config/queryKeys';

export const BUSINESS_ACCOUNT_QUERY_KEYS = {
  profile: (userId: string | undefined) =>
    [...BUSINESS_PROFILE_QUERY_KEY_ROOT, userId ?? 'no-session'] as const,
  accountMode: (userId: string | undefined) =>
    [...ACCOUNT_MODE_QUERY_KEY_ROOT, userId ?? 'no-session'] as const,
  myProfiles: (userId: string | undefined) =>
    [...MY_PROFILES_QUERY_KEY_ROOT, userId ?? 'no-session'] as const,
  claimSearch: (term: string) => ['businessClaimSearch', term] as const,
};
