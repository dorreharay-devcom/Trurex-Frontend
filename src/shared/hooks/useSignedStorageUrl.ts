import { useEffect, useState } from 'react';
import {
  imageTransformCacheSuffix,
  type StorageImageTransform,
} from '~/shared/lib/media/imageTransform';
import {
  cacheSignedUrl,
  getCachedSignedUrl,
  resolveSignedUrlOnce,
  signedUrlCacheKey,
} from '~/shared/lib/storage/signedUrlCache';

const DEFAULT_EXPIRES_IN_SEC = 3600;

function normalizeObjectPath(bucket: string, objectPath: string): string {
  const raw = (objectPath ?? '').trim().replace(/^\/+/, '');
  const bucketPrefix = `${bucket}/`;
  if (raw.startsWith(bucketPrefix)) return raw.slice(bucketPrefix.length);
  return raw;
}

export function useSignedStorageUrl(
  bucket: string,
  objectPath: string,
  expiresInSec = DEFAULT_EXPIRES_IN_SEC,
  cacheVersion?: string | number,
  transform?: StorageImageTransform | null,
): { uri: string | null; loading: boolean; cacheKey: string } {
  const path = normalizeObjectPath(bucket, objectPath);
  const transformKey = imageTransformCacheSuffix(transform);
  const cacheKey = path ? signedUrlCacheKey(bucket, path, transform, cacheVersion) : '';

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
      const resolved = await resolveSignedUrlOnce(cacheKey, bucket, path, expiresInSec, transform);
      if (!active) return;
      if (resolved) cacheSignedUrl(cacheKey, resolved);
      setUri(resolved?.url ?? null);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [bucket, path, cacheKey, expiresInSec, transformKey, transform]);

  return { uri, loading, cacheKey };
}
