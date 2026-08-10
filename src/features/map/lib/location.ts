import * as Location from 'expo-location';
import { isWeb } from '~/shared/lib/ui/platform';

export type LatLng = { lat: number; lng: number };

type GeoErr = GeolocationPositionError;

const NATIVE_POSITION_TIMEOUT_MS = 12000;
const GOOGLE_GEOLOCATE_TIMEOUT_MS = 5000;
const REVERSE_GEOCODE_TIMEOUT_MS = 5000;

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

async function resolveGoogleGeolocateFallback(
  promise: Promise<{ lat: number; lng: number } | null>,
): Promise<{ lat: number; lng: number } | null> {
  try {
    return await withTimeout(promise, GOOGLE_GEOLOCATE_TIMEOUT_MS);
  } catch {
    return null;
  }
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

  const google = await resolveGoogleGeolocateFallback(googlePromise);
  if (google) {
    return google;
  }

  if (browserFailedWith !== null && browserFailedWith !== undefined) {
    mapGeoReject(browserFailedWith);
  }

  throw new Error('Geolocation is not available in this environment.');
}

async function getCurrentLocationCoordsNative(
  requestPermission: boolean,
): Promise<LatLng> {
  const googlePromise = fetchGoogleGeolocateConsiderIp();

  const { status } = requestPermission
    ? await Location.requestForegroundPermissionsAsync()
    : await Location.getForegroundPermissionsAsync();

  if (status !== 'granted') {
    const google = await resolveGoogleGeolocateFallback(googlePromise);
    if (google) {
      return google;
    }
    throw new Error('PERMISSION_DENIED');
  }

  try {
    const pos = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      }),
      NATIVE_POSITION_TIMEOUT_MS,
    );
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    const google = await resolveGoogleGeolocateFallback(googlePromise);
    if (google) {
      return google;
    }
    throw new Error('POSITION_UNAVAILABLE');
  }
}

export type GetCurrentLocationCoordsOptions = {
  requestPermission?: boolean;
};

export async function getForegroundLocationPermission(): Promise<Location.PermissionStatus> {
  if (isWeb) {
    return Location.PermissionStatus.UNDETERMINED;
  }
  const { status } = await Location.getForegroundPermissionsAsync();
  return status;
}

export async function getCurrentLocationCoords(
  options?: GetCurrentLocationCoordsOptions,
): Promise<LatLng> {
  const requestPermission = options?.requestPermission !== false;
  if (isWeb) {
    return getCurrentLocationCoordsWeb();
  }
  return getCurrentLocationCoordsNative(requestPermission);
}

export async function reverseGeocodeLatLng(lat: number, lng: number): Promise<string | null> {
  const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key) return null;

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('latlng', `${lat},${lng}`);
    url.searchParams.set('key', key);
    const res = await withTimeout(fetch(url.toString()), REVERSE_GEOCODE_TIMEOUT_MS);
    const data = (await withTimeout(res.json(), REVERSE_GEOCODE_TIMEOUT_MS)) as {
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
