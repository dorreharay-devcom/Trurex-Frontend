import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '~/features/auth/providers';
import { useMapBoundsData } from '~/features/map/hooks/data/useMapBoundsData';
import { useMapDerivedData } from '~/features/map/hooks/data/useMapDerivedData';
import { useSavedRexOverrides } from '~/features/map/hooks/data/useSavedRexOverrides';
import { useMapSelection } from '~/features/map/hooks/useMapSelection';
import { useMapLocation } from '~/features/map/hooks/viewport/useMapLocation';
import { useMapViewport } from '~/features/map/hooks/viewport/useMapViewport';
import type { Recommendation } from '~/shared/types/recommendation';

type Params = {
  onRecommendationPress?: (rec: Recommendation) => void;
};

export function useMapScreen({ onRecommendationPress }: Params) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const { userCoords, recenterTo, locateMe, recenterOn, fitMarkers, fitCoords } = useMapLocation();
  const saved = useSavedRexOverrides();
  const selection = useMapSelection({ recenterOn, onRecommendationPress });
  const viewport = useMapViewport();
  const data = useMapBoundsData({
    bounds: viewport.queryBounds,
    searchTerm: viewport.debouncedSearch,
    needCardRows: true,
  });
  const derived = useMapDerivedData({
    fetchedRecs: data.fetchedRecs,
    pinRows: data.pinRows,
    layers: selection.layers,
    userId,
    withSavedOverride: saved.withSavedOverride,
    selectedRecId: selection.selectedRecId,
    suggestQuery: viewport.suggestQuery,
  });

  const fittedForSearchRef = useRef<string | null>(null);

  useEffect(() => {
    fittedForSearchRef.current = null;
  }, [viewport.debouncedSearch]);

  useEffect(() => {
    if (!viewport.debouncedSearch.trim()) return;
    if (derived.mapMarkers.length === 0) return;
    if (fittedForSearchRef.current === viewport.debouncedSearch) return;
    fittedForSearchRef.current = viewport.debouncedSearch;
    fitMarkers();
  }, [viewport.debouncedSearch, derived.mapMarkers.length, fitMarkers]);

  const selectMarker = useCallback(
    (id: string) => {
      const marker = derived.mapMarkers.find((m) => m.id === id);
      if (marker?.clusterCount && marker.memberCoords?.length) {
        fitCoords(marker.memberCoords);
        return;
      }
      selection.selectMarker(id);
    },
    [derived.mapMarkers, fitCoords, selection],
  );

  return {
    searchQuery: viewport.searchQuery,
    setSearchQuery: viewport.setSearchQuery,
    layers: selection.layers,
    setLayers: selection.setLayers,
    mapMarkers: derived.mapMarkers,
    selectedRecId: selection.selectedRecId,
    selectedRec: derived.selectedRec,
    selectedPinType: derived.selectedPinType,
    selectMarker,
    clearSelection: selection.clearSelection,
    listView: selection.listView,
    setListView: selection.setListView,
    onBoundsChange: viewport.onBoundsChange,
    openRec: selection.openRec,
    suggestions: derived.suggestions,
    isLoading: data.isLoading,
    isError: data.isError,
    isPinsError: data.isPinsError,
    refetch: data.refetch,
    userId,
    userCoords,
    recenterTo,
    mapRegion: viewport.mapRegion,
    locateMe,
    focusOnRecommendation: selection.focusOnRecommendation,
    locatedRecsForList: derived.layerFiltered,
    locatedRexCount: derived.locatedRexCount,
    markRecSaved: saved.markRecSaved,
    markRecUnsaved: saved.markRecUnsaved,
    clearRecSavedOverride: saved.clearRecSavedOverride,
  };
}
