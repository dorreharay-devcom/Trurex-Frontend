import { useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { isAndroid } from '~/shared/lib/ui/platform';

const ANDROID_TILE_LOAD_TIMEOUT_MS = 2500;
const ANDROID_MAX_TILE_RETRIES = 1;

export function useAndroidMapRemount() {
  const tileRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tileRetryCountRef = useRef(0);
  const [mapLayoutReady, setMapLayoutReady] = useState(!isAndroid);
  const [androidMapKey, setAndroidMapKey] = useState(0);

  const clearTileRetry = useCallback(() => {
    if (tileRetryRef.current == null) return;
    clearTimeout(tileRetryRef.current);
    tileRetryRef.current = null;
  }, []);

  useEffect(() => clearTileRetry, [clearTileRetry]);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    if (!isAndroid) return;
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) setMapLayoutReady(true);
  }, []);

  const handleMapReady = useCallback(() => {
    if (!isAndroid) return;
    clearTileRetry();
    if (tileRetryCountRef.current >= ANDROID_MAX_TILE_RETRIES) return;
    tileRetryRef.current = setTimeout(() => {
      tileRetryCountRef.current += 1;
      setAndroidMapKey((key) => key + 1);
    }, ANDROID_TILE_LOAD_TIMEOUT_MS);
  }, [clearTileRetry]);

  const handleMapLoaded = useCallback(() => {
    if (!isAndroid) return;
    tileRetryCountRef.current = ANDROID_MAX_TILE_RETRIES;
    clearTileRetry();
  }, [clearTileRetry]);

  return {
    mapLayoutReady,
    androidMapKey,
    handleContainerLayout,
    handleMapReady,
    handleMapLoaded,
  };
}
