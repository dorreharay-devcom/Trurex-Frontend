import { isPlainObject } from '~/shared/lib/data/guards';
import type { UserConfigRow } from '~/shared/types/userConfig';

export const BUSINESS_SIGNUP_ERROR_CODE = {
  ineligible: 'BIZ01',
  invalidName: '22023',
} as const;

export type BusinessSignupErrorCode =
  (typeof BUSINESS_SIGNUP_ERROR_CODE)[keyof typeof BUSINESS_SIGNUP_ERROR_CODE];

export function requiresBusinessSignup(
  config: Pick<UserConfigRow, 'is_business_account'> | null,
): boolean {
  return config?.is_business_account !== true;
}

function hasBusinessSignupErrorCode(error: unknown, code: BusinessSignupErrorCode): boolean {
  return isPlainObject(error) && error.code === code;
}

export function isBusinessSignupIneligibleError(error: unknown): boolean {
  return hasBusinessSignupErrorCode(error, BUSINESS_SIGNUP_ERROR_CODE.ineligible);
}

export function isBusinessSignupInvalidNameError(error: unknown): boolean {
  return hasBusinessSignupErrorCode(error, BUSINESS_SIGNUP_ERROR_CODE.invalidName);
}
