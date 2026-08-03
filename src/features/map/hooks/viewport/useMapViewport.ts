import { useCallback, useState } from 'react';
import type { Region } from 'react-native-maps';
import { MAP_BOUNDS_DEBOUNCE_MS } from '~/features/map/config/mapUi';
import { boundsToRegion, DEFAULT_MAP_BOUNDS, type LatLngBounds } from '~/features/map/lib/geo';
import { MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH } from '~/features/map/lib/mapSearchSuggestions';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';

export function useMapViewport() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), DEFAULT_SEARCH_DEBOUNCE_MS);
  const debouncedSearchSuggest = useDebouncedValue(searchQuery, DEFAULT_SEARCH_DEBOUNCE_MS);

  const [bounds, setBounds] = useState<LatLngBounds>(DEFAULT_MAP_BOUNDS);
  const debouncedBounds = useDebouncedValue(bounds, MAP_BOUNDS_DEBOUNCE_MS);
  const [mapRegion, setMapRegion] = useState<Region>(() => boundsToRegion(DEFAULT_MAP_BOUNDS));

  const onBoundsChange = useCallback((next: LatLngBounds, region?: Region) => {
    setBounds(next);
    setMapRegion(region ?? boundsToRegion(next));
  }, []);

  const suggestQuery =
    searchQuery.trim().length < MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH
      ? searchQuery
      : debouncedSearchSuggest;

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    suggestQuery,
    debouncedBounds,
    mapRegion,
    onBoundsChange,
  };
}
