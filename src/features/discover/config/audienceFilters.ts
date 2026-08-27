export const AUDIENCE_FILTER = {
  broaderNetwork: 'broader_network',
  trusted: 'trusted',
  inner: 'inner_circle',
  private: 'private',
} as const;

export type AudienceFilterId = (typeof AUDIENCE_FILTER)[keyof typeof AUDIENCE_FILTER];

export const AUDIENCE_FILTER_OPTIONS = [
  { id: AUDIENCE_FILTER.broaderNetwork, label: 'Broader Network (Public)' },
  { id: AUDIENCE_FILTER.trusted, label: 'Trusted' },
  { id: AUDIENCE_FILTER.inner, label: 'Inner' },
  { id: AUDIENCE_FILTER.private, label: 'Private' },
] as const;
