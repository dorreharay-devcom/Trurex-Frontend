export const TRUREX_WEB_ORIGIN = 'https://app.trurex.com';

export function buildPublicWebPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${TRUREX_WEB_ORIGIN}${normalized}`;
}

export function buildCurrentWebPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : TRUREX_WEB_ORIGIN;
  return `${origin}${normalized}`;
}
