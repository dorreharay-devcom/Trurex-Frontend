export const AuthSessionErrorCode = {
  RefreshTokenNotFound: 'refresh_token_not_found',
  BadJwt: 'bad_jwt',
} as const;

export function isFatalAuthSessionErrorCode(code: unknown): boolean {
  return code === AuthSessionErrorCode.RefreshTokenNotFound || code === AuthSessionErrorCode.BadJwt;
}
