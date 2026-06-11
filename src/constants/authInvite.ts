export const SIGNUP_INVITE_CODE_ENABLED = true;
export const SIGNUP_INVITE_CODE = '110626';

export function normalizeInviteCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6);
}

export function isSignupInviteCodeValid(value: string): boolean {
  return !SIGNUP_INVITE_CODE_ENABLED || normalizeInviteCode(value) === SIGNUP_INVITE_CODE;
}
