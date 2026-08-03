export const PROFILE_TAB = {
  recs: 'recs',
  collections: 'collections',
} as const;

export type ProfileTab = (typeof PROFILE_TAB)[keyof typeof PROFILE_TAB];

export const PROFILE_TABS = [
  { id: PROFILE_TAB.recs, label: 'Rex' },
  { id: PROFILE_TAB.collections, label: 'Collections' },
] as const;
