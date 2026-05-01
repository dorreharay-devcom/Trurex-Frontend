import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Backend } from '~/services/AuthService';
import { isNonEmptyString, isPlainObject } from '~/utils/guards';

type CacheEntry = { url: string; expiresAt: number };

const STORAGE_KEY = 'trurex_signed_url_cache_v1';

const urlCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<{ url: string; cacheUntil: number } | null>>();
const SIGNED_READ_BUFFER_MS = 60_000;

// On web: restore valid entries from localStorage so reloads skip API calls
function loadPersistedCache() {
  if (Platform.OS !== 'web') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const entries: [string, CacheEntry][] = JSON.parse(raw);
    const now = Date.now();
    for (const [key, entry] of entries) {
      if (entry.expiresAt - 60_000 > now) {
        urlCache.set(key, entry);
      }
    }
  } catch {}
}

function persistCache() {
  if (Platform.OS !== 'web') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(urlCache.entries())));
  } catch {}
}

loadPersistedCache();

function getCached(key: string): string | null {
  const e = urlCache.get(key);
  if (!e) return null;
  if (Date.now() >= e.expiresAt - SIGNED_READ_BUFFER_MS) {
    urlCache.delete(key);
    return null;
  }
  return e.url;
}

function parseSignedUrlData(data: unknown): string | null {
  if (data == null) {
    return null;
  }
  if (isNonEmptyString(data)) {
    return data;
  }
  if (!isPlainObject(data)) {
    return null;
  }
  const u = data.signedUrl;
  if (isNonEmptyString(u)) {
    return u;
  }
  return null;
}

async function resolveUrl(
  bucket: string,
  path: string,
  expiresInSec: number,
): Promise<{ url: string; cacheUntil: number } | null> {
  try {
    // 1. Try to create a signed URL first
    const { data, error } = await Backend.storage.from(bucket).createSignedUrl(path, expiresInSec);

    if (!error && data) {
      const u = parseSignedUrlData(data);
      if (u) {
        return { url: u, cacheUntil: Date.now() + expiresInSec * 1000 };
      }
    }

    // 2. Fallback to Public URL if signed URL failed
    // (This handles public buckets when the user is not logged in)
    const { data: publicData } = Backend.storage.from(bucket).getPublicUrl(path);
    if (publicData?.publicUrl) {
      return {
        url: publicData.publicUrl,
        cacheUntil: Date.now() + 24 * 60 * 60 * 1000, // Cache public URLs for a day
      };
    }

    return null;
  } catch {
    return null;
  }
}

function resolveUrlOnce(
  cacheKey: string,
  bucket: string,
  path: string,
  expiresInSec: number,
): Promise<{ url: string; cacheUntil: number } | null> {
  const existing = inFlight.get(cacheKey);
  if (existing) return existing;
  const p = resolveUrl(bucket, path, expiresInSec).finally(() => {
    inFlight.delete(cacheKey);
  });
  inFlight.set(cacheKey, p);
  return p;
}

export function useSignedStorageUrl(
  bucket: string,
  objectPath: string,
  expiresInSec = 3600,
): { uri: string | null; loading: boolean } {
  const rawPath = (objectPath ?? '').trim().replace(/^\/+/, '');
  // If the path already starts with the bucket name, strip it to avoid double-prefixing
  const bucketPrefix = `${bucket}/`;
  const trimmed = rawPath.startsWith(bucketPrefix) ? rawPath.slice(bucketPrefix.length) : rawPath;

  const cacheKey = trimmed ? `${bucket}:${trimmed}` : '';

  const [uri, setUri] = useState<string | null>(() => (cacheKey ? getCached(cacheKey) : null));
  const [loading, setLoading] = useState(() => {
    if (!trimmed) return false;
    if (!cacheKey) return false;
    return getCached(cacheKey) == null;
  });

  useEffect(() => {
    if (!trimmed) {
      setUri(null);
      setLoading(false);
      return;
    }
    if (!cacheKey) {
      setUri(null);
      setLoading(false);
      return;
    }
    const hit = getCached(cacheKey);
    if (hit) {
      setUri(hit);
      setLoading(false);
      return;
    }
    setUri(null);
    setLoading(true);
    let active = true;
    void (async () => {
      const r = await resolveUrlOnce(cacheKey, bucket, trimmed, expiresInSec);
      if (!active) return;
      if (r) {
        urlCache.set(cacheKey, { url: r.url, expiresAt: r.cacheUntil });
        persistCache();
        setUri(r.url);
      } else {
        setUri(null);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [bucket, trimmed, cacheKey, expiresInSec]);

  return { uri, loading };
}
