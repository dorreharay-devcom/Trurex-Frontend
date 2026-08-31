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

export const AUDIENCE_FILTER_OPTIONS_NO_PRIVATE = AUDIENCE_FILTER_OPTIONS.filter(
  (option) => option.id !== AUDIENCE_FILTER.private,
);

// recommendation_feed's `circle_filter` param uses its own value vocabulary,
// distinct from the app's circle `system_kind` strings (e.g. 'inner' here vs 'inner_circle' there).
const AUDIENCE_FILTER_TO_CIRCLE_PARAM: Record<AudienceFilterId, string> = {
  [AUDIENCE_FILTER.broaderNetwork]: 'broader_network',
  [AUDIENCE_FILTER.trusted]: 'trusted',
  [AUDIENCE_FILTER.inner]: 'inner',
  [AUDIENCE_FILTER.private]: 'private',
};

export function audienceFilterToCircleParam(id: AudienceFilterId | null): string | null {
  return id ? AUDIENCE_FILTER_TO_CIRCLE_PARAM[id] : null;
}
