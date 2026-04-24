import { useEffect, useState } from 'react';
import { Image } from 'react-native';

type ContentFit = 'cover' | 'contain';

// Landscape threshold: width must be > height by at least 20%
const LANDSCAPE_RATIO = 1.2;

export function useImageContentFit(uri: string | null | undefined): ContentFit {
  const [fit, setFit] = useState<ContentFit>('cover');

  useEffect(() => {
    if (!uri) return;
    let cancelled = false;
    Image.getSize(
      uri,
      (w, h) => {
        if (!cancelled) setFit(w > h * LANDSCAPE_RATIO ? 'cover' : 'contain');
      },
      () => {
        if (!cancelled) setFit('cover');
      },
    );
    return () => { cancelled = true; };
  }, [uri]);

  return fit;
}
