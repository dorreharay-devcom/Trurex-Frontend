export const BUSINESS_PROFILE_VIEW = {
  asUser: 'asUser',
  page: 'page',
} as const;

export type BusinessProfileView =
  (typeof BUSINESS_PROFILE_VIEW)[keyof typeof BUSINESS_PROFILE_VIEW];

export const BUSINESS_PROFILE_VIEWS = [
  { id: BUSINESS_PROFILE_VIEW.asUser, label: 'Profile' },
  { id: BUSINESS_PROFILE_VIEW.page, label: 'Public Page' },
] as const;

const BUSINESS_PROFILE_VIEW_VALUES = new Set<string>(Object.values(BUSINESS_PROFILE_VIEW));

export function isBusinessProfileView(value: unknown): value is BusinessProfileView {
  return typeof value === 'string' && BUSINESS_PROFILE_VIEW_VALUES.has(value);
}

export function parseBusinessProfileViewParam(value: string | undefined): BusinessProfileView {
  return isBusinessProfileView(value) ? value : BUSINESS_PROFILE_VIEW.asUser;
}
