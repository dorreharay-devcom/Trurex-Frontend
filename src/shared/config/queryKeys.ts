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
export const PLACE_SUMMARY_QUERY_KEY = (rexId: string | undefined) =>
  [...PLACE_SUMMARY_QUERY_KEY_ROOT, rexId] as const;

export const PLACE_REXES_QUERY_KEY_ROOT = ['placeRexes'] as const;
export const PLACE_REXES_QUERY_KEY = (rexId: string, networkOnly: boolean) =>
  [...PLACE_REXES_QUERY_KEY_ROOT, rexId, networkOnly] as const;
