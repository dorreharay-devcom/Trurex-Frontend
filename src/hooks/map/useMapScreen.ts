import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import type { Recommendation } from '~/types/recommendation/recommendation';
import type { MapMarkerItem, MapRecenterTarget } from '~/types/map/mapMarker';
import type { LatLngBounds } from '~/utils/map/mapRecommendationData';
import {
  DEFAULT_MAP_BOUNDS,
  filterLocatedRecommendations,
  filterRecommendationsByPinLayers,
  mapPinRowToMapMarkerItem,
  pinRowPassesLayerVisibility,
} from '~/utils/map/mapRecommendationData';
import { MapApi } from '~/api/MapApi';
import { useAuth } from '~/services/AuthContext';
import type { PinVisibility } from '~/types/map/mapPin';
import { DEFAULT_PIN_VISIBILITY } from '~/types/map/mapPin';
import { mapSearchTitleSuggestions } from '~/utils/map/mapSearchSuggestions';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from '~/hooks/useDebouncedValue';

type Params = {
  onRecommendationPress?: (rec: Recommendation) => void;
};

const BOUNDS_DEBOUNCE_MS = 450;
const SEARCH_DEBOUNCE_MS = DEFAULT_SEARCH_DEBOUNCE_MS;
const SEARCH_SUGGEST_DEBOUNCE_MS = DEFAULT_SEARCH_DEBOUNCE_MS;

export function useMapScreen({ onRecommendationPress }: Params) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [bounds, setBounds] = useState<LatLngBounds>(DEFAULT_MAP_BOUNDS);
  const [debouncedBounds, setDebouncedBounds] = useState<LatLngBounds>(DEFAULT_MAP_BOUNDS);

  const [layers, setLayers] = useState<PinVisibility>(DEFAULT_PIN_VISIBILITY);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);
  const [listView, setListView] = useState(false);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const userCoordsRef = useRef(userCoords);
  userCoordsRef.current = userCoords;

  const [recenterTo, setRecenterTo] = useState<MapRecenterTarget | null>(null);
  const [savedByRecId, setSavedByRecId] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setTimeout(() => setDebouncedBounds(bounds), BOUNDS_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [bounds]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;
      const pos = await Location.getCurrentPositionAsync({});
      if (!cancelled) {
        setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      }
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
    const fallbackCached = () => {
      const c = userCoordsRef.current;
      if (c) applyLocatedCoords(c.latitude, c.longitude);
    };

    const tryExpo = async (): Promise<boolean> => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return false;
        const pos = await Location.getCurrentPositionAsync({});
        applyLocatedCoords(pos.coords.latitude, pos.coords.longitude);
        return true;
      } catch {
        return false;
      }
    };

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      const ok = await new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            applyLocatedCoords(pos.coords.latitude, pos.coords.longitude);
            resolve(true);
          },
          () => resolve(false),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
        );
      });
      if (ok) return;
      if (await tryExpo()) return;
      fallbackCached();
      return;
    }

    if (await tryExpo()) return;
    fallbackCached();
  }, [applyLocatedCoords]);

  const boundsQueryParams = useMemo(
    () => ({
      ...debouncedBounds,
      search_term: debouncedSearch.length > 0 ? debouncedSearch : null,
    }),
    [debouncedBounds, debouncedSearch],
  );

  const queryKeyBase = [
    boundsQueryParams.min_lat,
    boundsQueryParams.max_lat,
    boundsQueryParams.min_lng,
    boundsQueryParams.max_lng,
    boundsQueryParams.search_term ?? '',
  ] as const;

  const {
    data: fetchedRecs = [],
    isLoading: rexesLoading,
    isError,
    refetch: refetchRexes,
  } = useQuery({
    queryKey: ['mapRexesInBounds', ...queryKeyBase],
    queryFn: () => MapApi.mapRexesInBounds(boundsQueryParams),
    placeholderData: keepPreviousData,
  });

  const {
    data: pinRows = [],
    isLoading: pinsLoading,
    refetch: refetchPins,
  } = useQuery({
    queryKey: ['mapRexPins', ...queryKeyBase],
    queryFn: () => MapApi.mapRexPins(boundsQueryParams),
    placeholderData: keepPreviousData,
  });

  const refetch = useCallback(() => {
    void refetchRexes();
    void refetchPins();
  }, [refetchRexes, refetchPins]);

  const isLoading = rexesLoading || pinsLoading;

  const locatedRecs = useMemo(() => filterLocatedRecommendations(fetchedRecs), [fetchedRecs]);

  const withSavedOverride = useCallback(
    (rec: Recommendation): Recommendation => {
      if (!(rec.id in savedByRecId)) return rec;
      return { ...rec, isSaved: savedByRecId[rec.id] };
    },
    [savedByRecId],
  );

  const layerFiltered = useMemo(
    () => filterRecommendationsByPinLayers(locatedRecs, layers, userId).map(withSavedOverride),
    [locatedRecs, layers, userId, withSavedOverride],
  );

  const markRecSaved = useCallback((recId: string) => {
    setSavedByRecId((prev) => ({ ...prev, [recId]: true }));
  }, []);

  const markRecUnsaved = useCallback((recId: string) => {
    setSavedByRecId((prev) => ({ ...prev, [recId]: false }));
  }, []);

  const clearRecSavedOverride = useCallback((recId: string) => {
    setSavedByRecId((prev) => {
      if (!(recId in prev)) return prev;
      const next = { ...prev };
      delete next[recId];
      return next;
    });
  }, []);

  const mapMarkers: MapMarkerItem[] = useMemo(() => {
    const filteredPins = pinRows.filter((row) => pinRowPassesLayerVisibility(row, layers));
    return filteredPins.map(mapPinRowToMapMarkerItem);
  }, [pinRows, layers]);

  const [debouncedSearchSuggest, setDebouncedSearchSuggest] = useState('');

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setDebouncedSearchSuggest(searchQuery);
      return;
    }
    const t = setTimeout(() => setDebouncedSearchSuggest(searchQuery), SEARCH_SUGGEST_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const suggestions = useMemo(
    () => mapSearchTitleSuggestions(layerFiltered, debouncedSearchSuggest),
    [layerFiltered, debouncedSearchSuggest],
  );

  const selectedRec = useMemo(
    () => (selectedRecId ? (layerFiltered.find((r) => r.id === selectedRecId) ?? null) : null),
    [selectedRecId, layerFiltered],
  );

  const openRec = useCallback(
    (rec: Recommendation) => {
      onRecommendationPress?.(rec);
    },
    [onRecommendationPress],
  );

  const focusOnRecommendation = useCallback((rec: Recommendation) => {
    setListView(false);
    setSelectedRecId(rec.id);
    if (rec.latitude != null && rec.longitude != null) {
      setRecenterTo({ latitude: rec.latitude, longitude: rec.longitude, nonce: Date.now() });
    }
  }, []);

  const onBoundsChange = useCallback((next: LatLngBounds) => {
    setBounds(next);
  }, []);

  const selectMarker = useCallback((id: string) => {
    setSelectedRecId(id);
  }, []);

  const clearSelection = useCallback(() => setSelectedRecId(null), []);

  const fittedForSearchRef = useRef<string | null>(null);
  useEffect(() => {
    fittedForSearchRef.current = null;
  }, [debouncedSearch]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return;
    if (mapMarkers.length === 0) return;
    if (fittedForSearchRef.current === debouncedSearch) return;
    fittedForSearchRef.current = debouncedSearch;
    setRecenterTo({
      latitude: 0,
      longitude: 0,
      nonce: Date.now(),
      fitMarkers: true,
    });
  }, [debouncedSearch, mapMarkers]);

  const locatedRexCount = locatedRecs.length;

  return {
    searchQuery,
    setSearchQuery,
    layers,
    setLayers,
    mapMarkers,
    locatedRexCount,
    selectedRecId,
    selectedRec,
    selectMarker,
    clearSelection,
    listView,
    setListView,
    onBoundsChange,
    openRec,
    suggestions,
    isLoading,
    isError,
    refetch,
    userId,
    userCoords,
    recenterTo,
    locateMe,
    focusOnRecommendation,
    locatedRecsForList: layerFiltered,
    markRecSaved,
    markRecUnsaved,
    clearRecSavedOverride,
  };
}
