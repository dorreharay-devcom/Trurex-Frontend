import { Backend } from '~/shared/api/client';
import { isNonEmptyString, isPlainObject } from '~/shared/lib/data/guards';
import { terminateIfUnauthorizedRequestError } from '~/shared/lib/errors/restriction';
import { isWeb } from '~/shared/lib/ui/platform';

export type ResolvedSignedUrl = { url: string; cacheUntil: number };

type CacheEntry = { url: string; expiresAt: number };

const STORAGE_KEY = 'trurex_signed_url_cache_v1';
const EXPIRY_BUFFER_MS = 60_000;
const PUBLIC_URL_TTL_MS = 24 * 60 * 60 * 1000;

const urlCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<ResolvedSignedUrl | null>>();

function isFresh(entry: CacheEntry, now: number): boolean {
  return entry.expiresAt - EXPIRY_BUFFER_MS > now;
}

function loadPersistedCache() {
  if (!isWeb) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const entries: [string, CacheEntry][] = JSON.parse(raw);
    const now = Date.now();
    for (const [key, entry] of entries) {
      if (isFresh(entry, now)) urlCache.set(key, entry);
    }
  } catch {}
}

function persistCache() {
  if (!isWeb) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(urlCache.entries())));
  } catch {}
}

loadPersistedCache();

export function getCachedSignedUrl(key: string): string | null {
  const entry = urlCache.get(key);
  if (!entry) return null;
  if (!isFresh(entry, Date.now())) {
    urlCache.delete(key);
    return null;
  }
  return entry.url;
}

export function cacheSignedUrl(key: string, resolved: ResolvedSignedUrl): void {
  urlCache.set(key, { url: resolved.url, expiresAt: resolved.cacheUntil });
  persistCache();
}

function parseSignedUrlData(data: unknown): string | null {
  if (isNonEmptyString(data)) return data;
  if (!isPlainObject(data)) return null;
  if (isNonEmptyString(data.signedUrl)) return data.signedUrl;
  return null;
}

async function resolveUrl(
  bucket: string,
  path: string,
  expiresInSec: number,
): Promise<ResolvedSignedUrl | null> {
  try {
    const { data, error } = await Backend.storage.from(bucket).createSignedUrl(path, expiresInSec);

    if (error) {
      terminateIfUnauthorizedRequestError(error);
    }

    if (!error && data) {
      const signedUrl = parseSignedUrlData(data);
      if (signedUrl) {
        return { url: signedUrl, cacheUntil: Date.now() + expiresInSec * 1000 };
      }
    }

    const { data: publicData } = Backend.storage.from(bucket).getPublicUrl(path);
    if (publicData?.publicUrl) {
      return { url: publicData.publicUrl, cacheUntil: Date.now() + PUBLIC_URL_TTL_MS };
    }

    return null;
  } catch {
    return null;
  }
}

export function resolveSignedUrlOnce(
  cacheKey: string,
  bucket: string,
  path: string,
  expiresInSec: number,
): Promise<ResolvedSignedUrl | null> {
  const existing = inFlight.get(cacheKey);
  if (existing) return existing;

  const request = resolveUrl(bucket, path, expiresInSec).finally(() => {
    inFlight.delete(cacheKey);
  });
  inFlight.set(cacheKey, request);
  return request;
}
