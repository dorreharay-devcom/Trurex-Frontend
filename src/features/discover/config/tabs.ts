export const DISCOVER_TAB = {
  latestRex: 'latest_rex',
  rexRequest: 'rex_request',
  collections: 'collections',
} as const;

export type DiscoverTab = (typeof DISCOVER_TAB)[keyof typeof DISCOVER_TAB];

export const DISCOVER_TABS = [
  { id: DISCOVER_TAB.latestRex, label: 'Latest Rex', emoji: '🦖' },
  { id: DISCOVER_TAB.rexRequest, label: 'Rex Request', emoji: '📣' },
  { id: DISCOVER_TAB.collections, label: 'Collections', emoji: '📁' },
] as const;
