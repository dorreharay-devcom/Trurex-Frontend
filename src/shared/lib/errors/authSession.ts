import type { Session } from '@supabase/supabase-js';

export const AuthSessionErrorCode = {
  RefreshTokenNotFound: 'refresh_token_not_found',
  BadJwt: 'bad_jwt',
} as const;

export function isFatalAuthSessionErrorCode(code: unknown): boolean {
  return code === AuthSessionErrorCode.RefreshTokenNotFound || code === AuthSessionErrorCode.BadJwt;
}

export function isSameAuthSession(a: Session | null, b: Session | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.access_token === b.access_token &&
    a.refresh_token === b.refresh_token &&
    a.user.id === b.user.id &&
    a.expires_at === b.expires_at
  );
}
