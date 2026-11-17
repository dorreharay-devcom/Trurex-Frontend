export const BUSINESS_CLAIM_STATUS = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
} as const;

export type BusinessClaimStatus =
  (typeof BUSINESS_CLAIM_STATUS)[keyof typeof BUSINESS_CLAIM_STATUS];

const BUSINESS_CLAIM_STATUS_VALUES = new Set<string>(Object.values(BUSINESS_CLAIM_STATUS));

export function isBusinessClaimStatus(value: unknown): value is BusinessClaimStatus {
  return typeof value === 'string' && BUSINESS_CLAIM_STATUS_VALUES.has(value);
}

export function parseBusinessClaimStatus(value: unknown): BusinessClaimStatus | null {
  return isBusinessClaimStatus(value) ? value : null;
}
