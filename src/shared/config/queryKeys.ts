/**
 * React Query keys for rex data that multiple features read or invalidate.
 * Each key is owned by one feature (noted below); every other feature must
 * reference this registry instead of hardcoding the string.
 */
export const REX_QUERY_KEYS = {
  /** owner: pages/discover (feed) */
  discoverFeed: ['discover-recommendations'],
  /** owner: features/collections (saved rexes list) */
  mySavedRexes: ['my-saved-rexes'],
  /** owner: profile (own rexes list) */
  myRexes: ['my-rexes'],
  /** owner: search */
  searchRexes: ['search-rexes'],
  /** owner: map (rexes in visible bounds) */
  mapRexesInBounds: ['mapRexesInBounds'],
  /** owner: map (pin markers) */
  mapRexPins: ['mapRexPins'],
} as const;
