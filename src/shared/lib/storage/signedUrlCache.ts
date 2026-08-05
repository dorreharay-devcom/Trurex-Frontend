import { Backend } from '~/shared/api/client';
import { isNonEmptyString, isPlainObject } from '~/shared/lib/data/guards';
import { terminateIfUnauthorizedRequestError } from '~/shared/lib/errors/restriction';
import {
  imageTransformCacheSuffix,
  type StorageImageTransform,
} from '~/shared/lib/media/imageTransform';
import { StorageService } from '~/shared/lib/storage/kv';

export type ResolvedSignedUrl = { url: string; cacheUntil: number };

type CacheEntry = { url: string; expiresAt: number };

const STORAGE_KEY = 'trurex_signed_url_cache_v1';
const EXPIRY_BUFFER_MS = 60_000;
const PUBLIC_URL_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 280;
const PERSIST_DEBOUNCE_MS = 400;

const urlCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<ResolvedSignedUrl | null>>();
let persistTimer: ReturnType<typeof setTimeout> | null = null;

function isFresh(entry: CacheEntry, now: number): boolean {
  return entry.expiresAt - EXPIRY_BUFFER_MS > now;
}

function touch(key: string, entry: CacheEntry): void {
  urlCache.delete(key);
  urlCache.set(key, entry);
}

function evictIfNeeded(): void {
  while (urlCache.size > MAX_CACHE_ENTRIES) {
    const oldest = urlCache.keys().next().value;
    if (oldest == null) break;
    urlCache.delete(oldest);
  }
}

const hydratePromise = (async () => {
  try {
    const raw = await StorageService.getItem(STORAGE_KEY);
    if (!raw) return;
    const entries: [string, CacheEntry][] = JSON.parse(raw);
    const now = Date.now();
    for (const [key, entry] of entries) {
      if (isFresh(entry, now)) urlCache.set(key, entry);
    }
    evictIfNeeded();
  } catch {}
})();

function schedulePersist(): void {
  if (persistTimer != null) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistTimer = null;
    void StorageService.setItem(STORAGE_KEY, JSON.stringify(Array.from(urlCache.entries()))).catch(
      () => {},
    );
  }, PERSIST_DEBOUNCE_MS);
}

export function getCachedSignedUrl(key: string): string | null {
  const entry = urlCache.get(key);
  if (!entry) return null;
  if (!isFresh(entry, Date.now())) {
    urlCache.delete(key);
    return null;
  }
  touch(key, entry);
  return entry.url;
}

export function cacheSignedUrl(key: string, resolved: ResolvedSignedUrl): void {
  touch(key, { url: resolved.url, expiresAt: resolved.cacheUntil });
  evictIfNeeded();
  schedulePersist();
}

export function signedUrlCacheKey(
  bucket: string,
  path: string,
  transform?: StorageImageTransform | null,
  cacheVersion?: string | number,
): string {
  const version = cacheVersion == null ? '' : `:${cacheVersion}`;
  return `${bucket}:${path}${imageTransformCacheSuffix(transform)}${version}`;
}

function parseSignedUrlData(data: unknown): string | null {
  if (isNonEmptyString(data)) return data;
  if (!isPlainObject(data)) return null;
  if (isNonEmptyString(data.signedUrl)) return data.signedUrl;
  return null;
}

async function trySignedUrl(
  bucket: string,
  path: string,
  expiresInSec: number,
  transform?: StorageImageTransform | null,
): Promise<ResolvedSignedUrl | null> {
  const options = transform ? { transform } : undefined;
  const { data, error } = await Backend.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSec, options);

  if (error) {
    terminateIfUnauthorizedRequestError(error);
    return null;
  }

  const signedUrl = parseSignedUrlData(data);
  if (!signedUrl) return null;
  return { url: signedUrl, cacheUntil: Date.now() + expiresInSec * 1000 };
}

async function tryPublicUrl(
  bucket: string,
  path: string,
  transform?: StorageImageTransform | null,
): Promise<ResolvedSignedUrl | null> {
  const options = transform ? { transform } : undefined;
  const { data: publicData } = Backend.storage.from(bucket).getPublicUrl(path, options);
  if (!publicData?.publicUrl) return null;
  return { url: publicData.publicUrl, cacheUntil: Date.now() + PUBLIC_URL_TTL_MS };
}

async function resolveUrl(
  bucket: string,
  path: string,
  expiresInSec: number,
  transform?: StorageImageTransform | null,
): Promise<ResolvedSignedUrl | null> {
  try {
    if (transform) {
      return (
        (await trySignedUrl(bucket, path, expiresInSec, transform)) ??
        (await tryPublicUrl(bucket, path, transform)) ??
        (await trySignedUrl(bucket, path, expiresInSec, null)) ??
        (await tryPublicUrl(bucket, path, null))
      );
    }

    return (
      (await trySignedUrl(bucket, path, expiresInSec, null)) ??
      (await tryPublicUrl(bucket, path, null))
    );
  } catch {
    return null;
  }
}

export function resolveSignedUrlOnce(
  cacheKey: string,
  bucket: string,
  path: string,
  expiresInSec: number,
  transform?: StorageImageTransform | null,
): Promise<ResolvedSignedUrl | null> {
  const existing = inFlight.get(cacheKey);
  if (existing) return existing;

  const request = (async () => {
    await hydratePromise;
    const entry = urlCache.get(cacheKey);
    if (entry && isFresh(entry, Date.now())) {
      touch(cacheKey, entry);
      return { url: entry.url, cacheUntil: entry.expiresAt };
    }
    return resolveUrl(bucket, path, expiresInSec, transform);
  })().finally(() => {
    inFlight.delete(cacheKey);
  });

  inFlight.set(cacheKey, request);
  return request;
}
