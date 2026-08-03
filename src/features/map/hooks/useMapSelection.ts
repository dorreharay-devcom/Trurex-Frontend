import { useCallback, useState } from 'react';
import { DEFAULT_PIN_VISIBILITY } from '~/features/map/config/pins';
import type { PinVisibility } from '~/features/map/types/mapPin';
import type { Recommendation } from '~/shared/types/recommendation';

type Params = {
  recenterOn: (latitude: number, longitude: number) => void;
  onRecommendationPress?: (rec: Recommendation) => void;
};

export function useMapSelection({ recenterOn, onRecommendationPress }: Params) {
  const [layers, setLayers] = useState<PinVisibility>(DEFAULT_PIN_VISIBILITY);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);
  const [listView, setListView] = useState(false);

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
    [recenterOn],
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
