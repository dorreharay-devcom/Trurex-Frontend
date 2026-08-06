export function stripTrail(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

export function isOAuthCallbackPath(pathname: string): boolean {
  const normalized = stripTrail(pathname.toLowerCase());
  return normalized === '/auth/callback' || normalized.endsWith('/auth/callback');
}

function sameAuthority(a: URL, b: URL): boolean {
  return a.protocol === b.protocol && a.host === b.host;
}

function samePath(a: URL, b: URL): boolean {
  return stripTrail(a.pathname) === stripTrail(b.pathname);
}

export function isSafeOAuthCallbackUrl(callbackUrl: string, expectedRedirectUrl: string): boolean {
  try {
    const callback = new URL(callbackUrl);
    const expected = new URL(expectedRedirectUrl);
    if (!sameAuthority(callback, expected)) return false;
    return samePath(callback, expected) || isOAuthCallbackPath(callback.pathname);
  } catch {
    return false;
  }
}

const MAX_CODE_LENGTH = 2048;
const MAX_TOKEN_LENGTH = 8192;
const JWT_SEGMENT_RE = /^[A-Za-z0-9_-]+$/;
const CREDENTIAL_RE = /^[A-Za-z0-9._~\-+/=]+$/;

export function isLikelyJwt(token: string): boolean {
  if (token.length === 0 || token.length > MAX_TOKEN_LENGTH) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  return parts.every((p) => p.length > 0 && JWT_SEGMENT_RE.test(p));
}

export function isSafeOAuthCode(code: string): boolean {
  if (code.length === 0 || code.length > MAX_CODE_LENGTH) return false;
  return CREDENTIAL_RE.test(code);
}

export function isSafeRefreshToken(token: string): boolean {
  if (token.length === 0 || token.length > MAX_TOKEN_LENGTH) return false;
  return CREDENTIAL_RE.test(token);
}
