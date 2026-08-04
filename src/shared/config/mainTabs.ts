export const TAB = {
  discover: 'discover',
  faves: 'faves',
  circles: 'circles',
  map: 'map',
  profile: 'profile',
} as const;

export type Tab = (typeof TAB)[keyof typeof TAB];

const TAB_VALUES = new Set<string>(Object.values(TAB));

export function isTab(value: unknown): value is Tab {
  return typeof value === 'string' && TAB_VALUES.has(value);
}
