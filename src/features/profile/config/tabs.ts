export const PROFILE_TAB = {
  recs: 'recs',
  collections: 'collections',
} as const;

export type ProfileTab = (typeof PROFILE_TAB)[keyof typeof PROFILE_TAB];

export const PROFILE_TABS = [
  { id: PROFILE_TAB.recs, label: 'Rex' },
  { id: PROFILE_TAB.collections, label: 'Collections' },
] as const;

const PROFILE_TAB_VALUES = new Set<string>(Object.values(PROFILE_TAB));

export function isProfileTab(value: unknown): value is ProfileTab {
  return typeof value === 'string' && PROFILE_TAB_VALUES.has(value);
}

export function parseProfileTabParam(value: string | undefined): ProfileTab {
  return value === PROFILE_TAB.collections ? PROFILE_TAB.collections : PROFILE_TAB.recs;
}
