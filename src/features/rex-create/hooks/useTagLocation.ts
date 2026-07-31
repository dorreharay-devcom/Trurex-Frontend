import { useCallback } from 'react';
import {
  useManualPlaceGeotag,
  type ManualPlaceGeotagResult,
} from '~/hooks/location/useManualPlaceGeotag';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { SEARCH_MODE } from '~/types/recommendation/create';

export function useTagLocation(flow: CreateRecFlow) {
  const { searchMode, applyOnlineGeotag, setManualAddress, setManualGeotag } = flow.place;

  const applyGeotag = useCallback(
    (result: ManualPlaceGeotagResult) => {
      if (searchMode === SEARCH_MODE.online) {
        applyOnlineGeotag(result);
        return;
      }
      setManualAddress(result.addressLabel);
      setManualGeotag({ lat: result.lat, lng: result.lng });
    },
    [searchMode, setManualAddress, setManualGeotag, applyOnlineGeotag],
  );

  const { isGeotagging, geotag: handleTagLocation } = useManualPlaceGeotag({
    onSuccess: applyGeotag,
  });

  return { isGeotagging, handleTagLocation };
}
