import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { MAP_LOCATION_PROMPT_DISMISSED_KEY } from '~/features/map/config/mapUi';
import { StorageService } from '~/shared/lib/storage/kv';

type Params = {
  locateMe: () => void | Promise<void>;
  mapViewVisible: boolean;
};

export function useMapLocationPrompt({ locateMe, mapViewVisible }: Params) {
  const [promptVisible, setPromptVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dismissed = await StorageService.getItem(MAP_LOCATION_PROMPT_DISMISSED_KEY);
        if (cancelled || dismissed === '1') return;
        const { status } = await Location.getForegroundPermissionsAsync();
        if (cancelled || status === 'granted') return;
        setPromptVisible(true);
      } catch {
        if (!cancelled) setPromptVisible(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onNotNow = useCallback(async () => {
    await StorageService.setItem(MAP_LOCATION_PROMPT_DISMISSED_KEY, '1');
    setPromptVisible(false);
  }, []);

  const onAllow = useCallback(async () => {
    setPromptVisible(false);
    await Location.requestForegroundPermissionsAsync();
    void locateMe();
  }, [locateMe]);

  return {
    visible: mapViewVisible && promptVisible,
    onAllow,
    onNotNow,
  };
}
