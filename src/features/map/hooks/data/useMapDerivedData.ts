import { useMemo } from 'react';
import { filterLocatedRecommendations } from '~/features/map/lib/filters';
import { mapSearchTitleSuggestions } from '~/features/map/lib/mapSearchSuggestions';
import {
  apiPinTypeToMapPinType,
  filterRecommendationsByPinLayers,
  mapPinRowToMapMarkerItem,
  mapPinTypeForRecommendation,
  pinRowPassesLayerVisibility,
} from '~/features/map/lib/pinTypes';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';
import type { MapPinType, PinVisibility } from '~/features/map/types/mapPin';
import type { MapPinRow } from '~/features/map/types/mapPinRow';
import type { Recommendation } from '~/shared/types/recommendation';

type Params = {
  fetchedRecs: Recommendation[];
  pinRows: MapPinRow[];
  layers: PinVisibility;
  userId: string | null;
  withSavedOverride: (rec: Recommendation) => Recommendation;
  selectedRecId: string | null;
  suggestQuery: string;
};

export function useMapDerivedData({
  fetchedRecs,
  pinRows,
  layers,
  userId,
  withSavedOverride,
  selectedRecId,
  suggestQuery,
}: Params) {
  const locatedRecs = useMemo(() => filterLocatedRecommendations(fetchedRecs), [fetchedRecs]);

  const pinTypeByRecId = useMemo(() => {
    const map = new Map<string, MapPinType>();
    for (const row of pinRows) {
      map.set(row.rex_id, apiPinTypeToMapPinType(row.pin_type, row));
    }
    return map;
  }, [pinRows]);

  const layerFiltered = useMemo(
    () =>
      filterRecommendationsByPinLayers(locatedRecs, layers, userId, pinTypeByRecId).map(
        withSavedOverride,
      ),
    [locatedRecs, layers, userId, pinTypeByRecId, withSavedOverride],
  );

  const mapMarkers: MapMarkerItem[] = useMemo(() => {
    const filteredPins = pinRows.filter((row) => pinRowPassesLayerVisibility(row, layers));
    return filteredPins.map(mapPinRowToMapMarkerItem);
  }, [pinRows, layers]);

  const suggestions = useMemo(
    () => mapSearchTitleSuggestions(layerFiltered, suggestQuery),
    [layerFiltered, suggestQuery],
  );

  const selectedRec = useMemo(() => {
    if (!selectedRecId) return null;
    return layerFiltered.find((r) => r.id === selectedRecId) ?? null;
  }, [selectedRecId, layerFiltered]);

  const selectedPinType = useMemo((): MapPinType | null => {
    if (!selectedRec) return null;
    return mapPinTypeForRecommendation(selectedRec, pinTypeByRecId, userId);
  }, [selectedRec, pinTypeByRecId, userId]);

  return {
    locatedRexCount: locatedRecs.length,
    layerFiltered,
    mapMarkers,
    suggestions,
    selectedRec,
    selectedPinType,
  };
}
