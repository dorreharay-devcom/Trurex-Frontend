import { useCallback, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { RecSummary } from '~/features/collections/types/recSummary';
import { MAP_PIN_TYPE } from '~/features/map/config/pins';
import {
  formatDistanceKm,
  haversineKm,
  sortRecommendationsByDistance,
} from '~/features/map/lib/geo';
import { isOwnRecommendation } from '~/features/map/lib/pinTypes';
import type { MapPinType } from '~/features/map/types/mapPin';
import type { Recommendation } from '~/shared/types/recommendation';
import { isWeb } from '~/shared/lib/ui/platform';

type Flow = {
  selectedRec: Recommendation | null;
  selectedPinType: MapPinType | null;
  userCoords: { latitude: number; longitude: number } | null;
  userId: string | null;
  locatedRecsForList: Recommendation[];
  locatedRexCount: number;
  listView: boolean;
  isLoading: boolean;
  isError: boolean;
  isPinsError: boolean;
  searchQuery: string;
  mapMarkers: readonly unknown[];
  clearSelection: () => void;
  openRec: (rec: Recommendation) => void;
  markRecSaved: (id: string) => void;
  markRecUnsaved: (id: string) => void;
  clearRecSavedOverride: (id: string) => void;
  selectMarker: (id: string) => void;
  setListView: (value: boolean) => void;
};

type Params = {
  flow: Flow;
  onRexSheetOpenChange?: (open: boolean) => void;
};

function toRecSummary(rec: Recommendation): RecSummary {
  return {
    id: rec.id,
    place_name: rec.title,
    category_code: rec.category,
    location: rec.location,
    isSaved: rec.isSaved ?? false,
  };
}

export function useMapPageState({ flow, onRexSheetOpenChange }: Params) {
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);

  const {
    selectedRec,
    selectedPinType,
    userCoords,
    userId,
    locatedRecsForList,
    locatedRexCount,
    listView,
    isLoading,
    isPinsError,
    searchQuery,
    mapMarkers,
    clearSelection,
    openRec,
    markRecSaved,
    markRecUnsaved,
    clearRecSavedOverride,
    selectMarker,
    setListView,
  } = flow;

  useFocusEffect(
    useCallback(() => {
      onRexSheetOpenChange?.(Boolean(selectedRec));
      return () => onRexSheetOpenChange?.(false);
    }, [selectedRec, onRexSheetOpenChange]),
  );

  const distanceLabel = useMemo(() => {
    if (!selectedRec?.latitude || selectedRec.longitude == null || !userCoords) {
      return undefined;
    }
    return formatDistanceKm(
      haversineKm(userCoords, {
        latitude: selectedRec.latitude,
        longitude: selectedRec.longitude,
      }),
    );
  }, [selectedRec, userCoords]);

  const canSave = selectedRec != null && !isOwnRecommendation(selectedRec, userId);

  const sortedList = useMemo(
    () => sortRecommendationsByDistance(locatedRecsForList, userCoords),
    [locatedRecsForList, userCoords],
  );

  const mapViewVisible = !listView;
  const mapDataReady = !isLoading && !isPinsError;
  const hasSearchQuery = searchQuery.trim().length > 0;

  const onViewFullRex = useCallback(() => {
    if (!selectedRec) return;
    openRec(selectedRec);
    clearSelection();
  }, [selectedRec, openRec, clearSelection]);

  const onSave = useCallback(() => {
    if (!selectedRec) return;
    setSaveTarget(toRecSummary(selectedRec));
  }, [selectedRec]);

  const onCloseSave = useCallback(() => setSaveTarget(null), []);

  const toggleListView = useCallback(() => {
    setListView(!listView);
  }, [listView, setListView]);

  const onMarkerPress = useCallback(
    (id: string) => {
      if (!isWeb) Keyboard.dismiss();
      selectMarker(id);
    },
    [selectMarker],
  );

  return {
    sortedList,
    mapViewVisible,
    showMapLoadError: mapViewVisible && isPinsError,
    showEmptyMapAreaBanner:
      mapViewVisible && mapDataReady && locatedRexCount === 0 && !hasSearchQuery,
    showNoSearchMatchBanner:
      mapViewVisible && mapMarkers.length === 0 && hasSearchQuery,
    toggleListView,
    onMarkerPress,
    selectedRec,
    pinType: selectedPinType ?? MAP_PIN_TYPE.rex,
    distanceLabel,
    canSave,
    onClosePin: clearSelection,
    onViewFullRex,
    onSave,
    saveTarget,
    onCloseSave,
    markRecSaved,
    markRecUnsaved,
    clearRecSavedOverride,
  };
}
