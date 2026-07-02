export const AUTH_INVITE_CODE_ENABLED = true;
export const AUTH_INVITE_CODE = '110626';
export const AUTH_INVITE_CODE_LENGTH = 6;

export function normalizeInviteCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, AUTH_INVITE_CODE_LENGTH);
}

export function isAuthInviteCodeValid(value: string): boolean {
  return !AUTH_INVITE_CODE_ENABLED || normalizeInviteCode(value) === AUTH_INVITE_CODE;
}

export function getAuthInviteCodeValidationError(value: string): string | undefined {
  if (!AUTH_INVITE_CODE_ENABLED) return undefined;
  if (normalizeInviteCode(value).length < AUTH_INVITE_CODE_LENGTH) {
    return 'Enter your 6-digit invite code';
  }
  if (!isAuthInviteCodeValid(value)) return 'Enter a valid invite code';
  return undefined;
}
