import { useEffect, useState } from 'react';
import { Backend } from '~/services/AuthService';

interface CacheEntry {
  url: string;
  expiresAt: number;
}

// Module-level cache: survives re-renders and navigation, cleared on app restart
const urlCache = new Map<string, CacheEntry>();

function getCached(key: string): string | null {
  const entry = urlCache.get(key);
  if (!entry) return null;
  // 60s buffer before actual expiry
  if (Date.now() >= entry.expiresAt - 60_000) {
    urlCache.delete(key);
    return null;
  }
  return entry.url;
}

export function useSignedStorageUrl(
  bucket: string,
  objectPath: string,
  expiresInSec = 3600,
): { uri: string | null; loading: boolean } {
  const trimmed = objectPath?.trim() ?? '';
  const cacheKey = trimmed ? `${bucket}:${trimmed}` : '';

  const cached = cacheKey ? getCached(cacheKey) : null;

  const [uri, setUri] = useState<string | null>(cached);
  const [loading, setLoading] = useState(!cached && !!trimmed);

  useEffect(() => {
    if (!trimmed) {
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

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { data, error } = await Backend.storage
        .from(bucket)
        .createSignedUrl(trimmed, expiresInSec);
      if (cancelled) return;
      if (!error && data?.signedUrl) {
        urlCache.set(cacheKey, {
          url: data.signedUrl,
          expiresAt: Date.now() + expiresInSec * 1000,
        });
        setUri(data.signedUrl);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [bucket, trimmed, expiresInSec, cacheKey]);

  return { uri, loading };
}
