import { useCallback, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DEFAULT_PIN_VISIBILITY } from '~/features/map/config/pins';
import type { PinVisibility } from '~/features/map/types/mapPin';
import type { Recommendation } from '~/shared/types/recommendation';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';

type Params = {
  recenterOn: (latitude: number, longitude: number) => void;
  onRecommendationPress?: (rec: Recommendation) => void;
};

const MAP_VIEW = {
  map: 'map',
  list: 'list',
} as const;

export function useMapSelection({ recenterOn, onRecommendationPress }: Params) {
  const router = useRouter();
  const raw = useLocalSearchParams<{ view?: string | string[] }>();
  const listView = useMemo(() => firstRouteParam(raw.view) === MAP_VIEW.list, [raw.view]);

  const [layers, setLayers] = useState<PinVisibility>(DEFAULT_PIN_VISIBILITY);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

  const setListView = useCallback(
    (value: boolean) => {
      router.setParams({ view: value ? MAP_VIEW.list : MAP_VIEW.map });
    },
    [router],
  );

  const selectMarker = useCallback((id: string) => setSelectedRecId(id), []);
  const clearSelection = useCallback(() => setSelectedRecId(null), []);

  const openRec = useCallback(
    (rec: Recommendation) => {
      onRecommendationPress?.(rec);
    },
    [onRecommendationPress],
  );

  const focusOnRecommendation = useCallback(
    (rec: Recommendation) => {
      setListView(false);
      setSelectedRecId(rec.id);
      if (rec.latitude != null && rec.longitude != null) {
        recenterOn(rec.latitude, rec.longitude);
      }
    },
    [recenterOn, setListView],
  );

  return {
    layers,
    setLayers,
    selectedRecId,
    listView,
    setListView,
    selectMarker,
    clearSelection,
    openRec,
    focusOnRecommendation,
  };
}
