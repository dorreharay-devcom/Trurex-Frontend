import { useCallback, useEffect, useRef, useState } from 'react';
import type { MapRecenterTarget } from '~/features/map/types/mapMarker';
import { getCurrentLocationCoords } from '~/features/map/lib/location';

export type UserCoords = { latitude: number; longitude: number };

export function useMapLocation() {
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [recenterTo, setRecenterTo] = useState<MapRecenterTarget | null>(null);
  const userCoordsRef = useRef(userCoords);
  userCoordsRef.current = userCoords;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const coords = await getCurrentLocationCoords();
        if (!cancelled) setUserCoords({ latitude: coords.lat, longitude: coords.lng });
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyLocatedCoords = useCallback((latitude: number, longitude: number) => {
    setUserCoords({ latitude, longitude });
    setRecenterTo({ latitude, longitude, nonce: Date.now() });
  }, []);

  const locateMe = useCallback(async () => {
    try {
      const coords = await getCurrentLocationCoords();
      applyLocatedCoords(coords.lat, coords.lng);
      return;
    } catch {
      const cached = userCoordsRef.current;
      if (cached) applyLocatedCoords(cached.latitude, cached.longitude);
    }
  }, [applyLocatedCoords]);

  const recenterOn = useCallback((latitude: number, longitude: number) => {
    setRecenterTo({ latitude, longitude, nonce: Date.now() });
  }, []);

  const fitMarkers = useCallback(() => {
    setRecenterTo({ latitude: 0, longitude: 0, nonce: Date.now(), fitMarkers: true });
  }, []);

  return { userCoords, recenterTo, locateMe, recenterOn, fitMarkers };
}
