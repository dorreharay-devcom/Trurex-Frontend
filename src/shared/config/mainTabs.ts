import type { Href } from 'expo-router';

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

export const MAIN_TAB_HREF = {
  [TAB.discover]: '/discover',
  [TAB.faves]: '/gems',
  [TAB.circles]: '/circles',
  [TAB.map]: '/map',
  [TAB.profile]: '/profile',
} as const satisfies Record<Tab, Href>;

export function tabFromPathname(pathname: string | null | undefined): Tab {
  if (!pathname) return TAB.discover;
  const path = pathname.split('?')[0] ?? pathname;
  if (path === '/discover' || path.startsWith('/discover/')) return TAB.discover;
  if (path === '/gems' || path.startsWith('/gems/')) return TAB.faves;
  if (path === '/circles' || path.startsWith('/circles/')) return TAB.circles;
  if (path === '/map' || path.startsWith('/map/')) return TAB.map;
  if (path === '/profile' || path.startsWith('/profile/')) return TAB.profile;
  return TAB.discover;
}
