import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { MapRecenterTarget } from '~/features/map/types/mapMarker';
import {
  getCurrentLocationCoords,
  getForegroundLocationPermission,
} from '~/features/map/lib/location';

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
        const status = await getForegroundLocationPermission();
        if (cancelled || status !== Location.PermissionStatus.GRANTED) return;
        const coords = await getCurrentLocationCoords({ requestPermission: false });
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
      const coords = await getCurrentLocationCoords({ requestPermission: true });
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

  const fitCoords = useCallback((coords: { latitude: number; longitude: number }[]) => {
    if (coords.length === 0) return;
    const first = coords[0]!;
    setRecenterTo({
      latitude: first.latitude,
      longitude: first.longitude,
      nonce: Date.now(),
      fitCoords: coords,
    });
  }, []);

  return { userCoords, recenterTo, locateMe, recenterOn, fitMarkers, fitCoords };
}
