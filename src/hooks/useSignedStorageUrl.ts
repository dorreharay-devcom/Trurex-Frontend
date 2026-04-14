import { useEffect, useState } from 'react';
import { Backend } from '~/services/AuthService';

export function useSignedStorageUrl(
  bucket: string,
  objectPath: string,
  expiresInSec = 3600,
): { uri: string | null; loading: boolean } {
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const trimmed = objectPath?.trim() ?? '';
    if (!trimmed) {
      setUri(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setUri(null);

    (async () => {
      const { data, error } = await Backend.storage
        .from(bucket)
        .createSignedUrl(trimmed, expiresInSec);
      if (cancelled) return;
      if (!error && data?.signedUrl) setUri(data.signedUrl);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [bucket, objectPath, expiresInSec]);

  return { uri, loading };
}
