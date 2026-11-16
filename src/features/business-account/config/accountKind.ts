export const ACCOUNT_KIND = {
  regular: 'regular',
  converted: 'converted',
  businessOnly: 'business_only',
} as const;

export type AccountKind = (typeof ACCOUNT_KIND)[keyof typeof ACCOUNT_KIND];

const ACCOUNT_KIND_VALUES = new Set<string>(Object.values(ACCOUNT_KIND));

export function isAccountKind(value: unknown): value is AccountKind {
  return typeof value === 'string' && ACCOUNT_KIND_VALUES.has(value);
}

export function parseAccountKind(value: unknown): AccountKind | null {
  return isAccountKind(value) ? value : null;
}
