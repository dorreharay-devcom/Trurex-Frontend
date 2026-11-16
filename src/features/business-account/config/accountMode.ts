export const ACCOUNT_MODE = {
  personal: 'personal',
  business: 'business',
} as const;

export type AccountMode = (typeof ACCOUNT_MODE)[keyof typeof ACCOUNT_MODE];

const ACCOUNT_MODE_VALUES = new Set<string>(Object.values(ACCOUNT_MODE));

export function isAccountMode(value: unknown): value is AccountMode {
  return typeof value === 'string' && ACCOUNT_MODE_VALUES.has(value);
}

export function parseAccountMode(value: unknown): AccountMode | null {
  return isAccountMode(value) ? value : null;
}

export const ACCOUNT_MODE_OPTIONS = [
  {
    id: ACCOUNT_MODE.personal,
    label: 'Personal',
    description: 'Post and comment as yourself',
  },
  {
    id: ACCOUNT_MODE.business,
    label: 'Business',
    description: 'Post and comment as your business',
  },
] as const;
