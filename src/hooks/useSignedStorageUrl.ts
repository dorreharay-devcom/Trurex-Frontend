import { useEffect, useState } from 'react';
import { Backend } from '~/services/AuthService';
import { isNonEmptyString, isPlainObject } from '~/utils';

type CacheEntry = { url: string; expiresAt: number };

const urlCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<{ url: string; cacheUntil: number } | null>>();
const SIGNED_READ_BUFFER_MS = 60_000;

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
    const { data, error } = await Backend.storage.from(bucket).createSignedUrl(path, expiresInSec);
    if (error) {
      return null;
    }
    const u = parseSignedUrlData(data);
    if (!u) {
      return null;
    }
    return { url: u, cacheUntil: Date.now() + expiresInSec * 1000 };
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
  const trimmed = (objectPath ?? '').trim().replace(/^\/+/, '');
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
