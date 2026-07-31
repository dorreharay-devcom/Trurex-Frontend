import { useEffect, useState } from 'react';
import {
  cacheSignedUrl,
  getCachedSignedUrl,
  resolveSignedUrlOnce,
} from '~/shared/lib/signedUrlCache';

const DEFAULT_EXPIRES_IN_SEC = 3600;

function normalizeObjectPath(bucket: string, objectPath: string): string {
  const raw = (objectPath ?? '').trim().replace(/^\/+/, '');
  // If the path already starts with the bucket name, strip it to avoid double-prefixing.
  const bucketPrefix = `${bucket}/`;
  if (raw.startsWith(bucketPrefix)) return raw.slice(bucketPrefix.length);
  return raw;
}

export function useSignedStorageUrl(
  bucket: string,
  objectPath: string,
  expiresInSec = DEFAULT_EXPIRES_IN_SEC,
  cacheVersion?: string | number,
): { uri: string | null; loading: boolean } {
  const path = normalizeObjectPath(bucket, objectPath);
  const version = cacheVersion == null ? '' : `:${cacheVersion}`;
  const cacheKey = path ? `${bucket}:${path}${version}` : '';

  const [uri, setUri] = useState<string | null>(() =>
    cacheKey ? getCachedSignedUrl(cacheKey) : null,
  );
  const [loading, setLoading] = useState(
    () => Boolean(cacheKey) && getCachedSignedUrl(cacheKey) == null,
  );

  useEffect(() => {
    if (!cacheKey) {
      setUri(null);
      setLoading(false);
      return;
    }

    const hit = getCachedSignedUrl(cacheKey);
    if (hit) {
      setUri(hit);
      setLoading(false);
      return;
    }

    setUri(null);
    setLoading(true);
    let active = true;
    void (async () => {
      const resolved = await resolveSignedUrlOnce(cacheKey, bucket, path, expiresInSec);
      if (!active) return;
      if (resolved) cacheSignedUrl(cacheKey, resolved);
      setUri(resolved?.url ?? null);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [bucket, path, cacheKey, expiresInSec]);

  return { uri, loading };
}
