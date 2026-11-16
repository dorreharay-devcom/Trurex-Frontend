import type { PlaceRef } from '~/shared/types/placeRef';

export const REX_QUERY_KEYS = {
  discoverFeed: ['discover-recommendations'],
  discoverCollectionsFeed: ['discover-collections-feed'],
  mySavedRexes: ['my-saved-rexes'],
  myRexes: ['my-rexes'],
  searchRexes: ['search-rexes'],
  mapRexesInBounds: ['mapRexesInBounds'],
  mapRexPins: ['mapRexPins'],
  thankCopyOptions: ['thank-copy-options'],
} as const;

export const CIRCLE_QUERY_KEYS = {
  myCircles: ['myCircles'],
} as const;

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;

export const REX_SCORE_TIERS_QUERY_KEY = ['rexScoreTiers'] as const;

export const REFERRALS_QUERY_KEY = ['myReferralInfo'] as const;

export const PLACE_SUMMARY_QUERY_KEY_ROOT = ['placeSummary'] as const;
export const PLACE_SUMMARY_QUERY_KEY = (ref: PlaceRef | null) =>
  [...PLACE_SUMMARY_QUERY_KEY_ROOT, ref?.kind ?? null, ref?.id ?? null] as const;

export const PLACE_REXES_QUERY_KEY_ROOT = ['placeRexes'] as const;
export const PLACE_REXES_QUERY_KEY = (ref: PlaceRef | null, networkOnly: boolean) =>
  [...PLACE_REXES_QUERY_KEY_ROOT, ref?.kind ?? null, ref?.id ?? null, networkOnly] as const;

export const USER_CONFIG_QUERY_KEY_ROOT = ['user_config'] as const;
export const USER_CONFIG_QUERY_KEY = (userId: string | undefined) =>
  [...USER_CONFIG_QUERY_KEY_ROOT, userId ?? 'no-session'] as const;

export const BUSINESS_PROFILE_QUERY_KEY_ROOT = ['businessProfile'] as const;

export const BUSINESS_ACCOUNT_REFRESH_KEYS = [
  USER_CONFIG_QUERY_KEY_ROOT,
  BUSINESS_PROFILE_QUERY_KEY_ROOT,
] as const;
