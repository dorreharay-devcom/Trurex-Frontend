import { Platform } from 'react-native';
import * as Location from 'expo-location';

export type LatLng = { lat: number; lng: number };

type GeoErr = GeolocationPositionError;

function mapGeoReject(err: GeoErr | unknown): never {
  const geo = err as GeoErr;
  if (geo?.code === 1) throw new Error('PERMISSION_DENIED');
  if (geo?.code === 2) throw new Error('POSITION_UNAVAILABLE');
  if (geo?.code === 3) throw new Error('TIMEOUT');
  throw err instanceof Error ? err : new Error(geo?.message || 'Geolocation failed');
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('TIMEOUT')), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

async function fetchGoogleGeolocateConsiderIp(): Promise<{ lat: number; lng: number } | null> {
  const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key) return null;

  try {
    const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ considerIp: true }),
    });
    const data = (await res.json()) as {
      error?: { message: string };
      location?: { lat: number; lng: number };
    };

    if (!res.ok || data.error) {
      return null;
    }

    const { lat, lng } = data.location ?? {};
    if (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {
      return { lat, lng };
    }
  } catch {
    return null;
  }

  return null;
}

function getCurrentPositionWebOnce(
  options: PositionOptions,
  raceMs: number,
): Promise<GeolocationPosition> {
  const p = new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
  return withTimeout(p, raceMs);
}

async function getCurrentLocationCoordsWeb(): Promise<LatLng> {
  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    throw new Error('INSECURE_CONTEXT');
  }

  const googlePromise = fetchGoogleGeolocateConsiderIp();

  let browserFailedWith: unknown = null;

  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    const attempts: { opts: PositionOptions; raceMs: number }[] = [
      { opts: { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }, raceMs: 11000 },
      { opts: { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }, raceMs: 9000 },
    ];

    for (const { opts, raceMs } of attempts) {
      try {
        const pos = await getCurrentPositionWebOnce(opts, raceMs);
        return { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (e) {
        browserFailedWith = e;
        const geo = e as GeoErr;
        if (geo?.code === 1) {
          break;
        }
        if (geo?.code === 2 || geo?.code === 3) {
          continue;
        }
        if (e instanceof Error && e.message === 'TIMEOUT') {
          continue;
        }
        mapGeoReject(e);
      }
    }
  }

  const google = await googlePromise;
  if (google) {
    return google;
  }

  if (browserFailedWith !== null && browserFailedWith !== undefined) {
    mapGeoReject(browserFailedWith);
  }

  throw new Error('Geolocation is not available in this environment.');
}

async function getCurrentLocationCoordsNative(): Promise<LatLng> {
  const googlePromise = fetchGoogleGeolocateConsiderIp();

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    const google = await googlePromise;
    if (google) {
      return google;
    }
    throw new Error('PERMISSION_DENIED');
  }

  try {
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    const google = await googlePromise;
    if (google) {
      return google;
    }
    throw new Error('POSITION_UNAVAILABLE');
  }
}

export async function getCurrentLocationCoords(): Promise<LatLng> {
  if (Platform.OS === 'web') {
    return getCurrentLocationCoordsWeb();
  }
  return getCurrentLocationCoordsNative();
}

export async function reverseGeocodeLatLng(lat: number, lng: number): Promise<string | null> {
  const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key) return null;

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('latlng', `${lat},${lng}`);
    url.searchParams.set('key', key);
    const res = await fetch(url.toString());
    const data = (await res.json()) as {
      status: string;
      results?: { formatted_address?: string }[];
    };
    if (data.status !== 'OK' || !data.results?.length) return null;
    const formatted = data.results[0]?.formatted_address;
    return typeof formatted === 'string' && formatted.trim() ? formatted.trim() : null;
  } catch {
    return null;
  }
}
