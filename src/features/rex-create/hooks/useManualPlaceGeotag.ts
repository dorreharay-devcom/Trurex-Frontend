import { useCallback, useState } from 'react';
import { getCurrentLocationCoords, reverseGeocodeLatLng } from '~/features/map/lib/location';
import { toastError } from '~/shared/lib/appToast';

export type ManualPlaceGeotagResult = {
  lat: number;
  lng: number;
  addressLabel: string;
};

export type UseManualPlaceGeotagOptions = {
  onSuccess: (result: ManualPlaceGeotagResult) => void;
  toastOnError?: boolean;
};

function toastGeotagFailure(error: unknown): void {
  const msg = error instanceof Error ? error.message : '';
  if (msg === 'INSECURE_CONTEXT') {
    toastError('Location', 'Geolocation requires HTTPS or localhost.');
    return;
  }
  if (msg === 'PERMISSION_DENIED') {
    toastError('Location', 'Permission is required to tag your current location.');
    return;
  }
  toastError('Location', 'Could not read your location. Try again or enter an address manually.');
}

async function fetchManualPlaceGeotag(): Promise<ManualPlaceGeotagResult> {
  const { lat, lng } = await getCurrentLocationCoords();
  const addressLabel =
    (await reverseGeocodeLatLng(lat, lng)) ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  return { lat, lng, addressLabel };
}

export function useManualPlaceGeotag({
  onSuccess,
  toastOnError = true,
}: UseManualPlaceGeotagOptions): {
  isGeotagging: boolean;
  geotag: () => Promise<void>;
} {
  const [isGeotagging, setIsGeotagging] = useState(false);

  const geotag = useCallback(async () => {
    setIsGeotagging(true);
    try {
      const result = await fetchManualPlaceGeotag();
      onSuccess(result);
    } catch (e) {
      if (toastOnError) {
        toastGeotagFailure(e);
      }
    } finally {
      setIsGeotagging(false);
    }
  }, [onSuccess, toastOnError]);

  return { isGeotagging, geotag };
}
