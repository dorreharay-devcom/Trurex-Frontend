import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

export const COLLECTIONS_QUERY_KEYS = {
  myCollections: ['my-collections'],
  mySavedCollections: ['my-saved-collections'],
  collectionDetail: ['collection-detail'],
  mySavedRexes: REX_QUERY_KEYS.mySavedRexes,
} as const;

/** Queries to refresh whenever a rex's saved state changes. */
export const SAVED_REX_DEPENDENT_QUERY_KEYS = [
  REX_QUERY_KEYS.mySavedRexes,
  REX_QUERY_KEYS.discoverFeed,
  REX_QUERY_KEYS.mapRexesInBounds,
  REX_QUERY_KEYS.mapRexPins,
] as const;
