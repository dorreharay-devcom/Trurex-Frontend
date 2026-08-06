import { useCallback, useEffect, useRef, useState } from 'react';
import type { Region } from 'react-native-maps';
import { MAP_BOUNDS_DEBOUNCE_MS, MAP_QUERY_BOUNDS_PAD_FACTOR } from '~/features/map/config/mapUi';
import {
  boundsToRegion,
  DEFAULT_MAP_BOUNDS,
  expandBounds,
  isViewportCoveredBy,
  roundBounds,
  type LatLngBounds,
} from '~/features/map/lib/geo';
import { MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH } from '~/features/map/lib/mapSearchSuggestions';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';

function toQueryBounds(view: LatLngBounds): LatLngBounds {
  return expandBounds(roundBounds(view), MAP_QUERY_BOUNDS_PAD_FACTOR);
}

export function useMapViewport() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), DEFAULT_SEARCH_DEBOUNCE_MS);
  const debouncedSearchSuggest = useDebouncedValue(searchQuery, DEFAULT_SEARCH_DEBOUNCE_MS);

  const [queryBounds, setQueryBounds] = useState<LatLngBounds | null>(null);
  const coverageRef = useRef<LatLngBounds | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mapRegion] = useState<Region>(() => boundsToRegion(DEFAULT_MAP_BOUNDS));
  const [viewRegion, setViewRegion] = useState<Region>(() => boundsToRegion(DEFAULT_MAP_BOUNDS));

  const onBoundsChange = useCallback((next: LatLngBounds, region?: Region) => {
    if (region) setViewRegion(region);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const coverage = coverageRef.current;
      if (coverage && isViewportCoveredBy(next, coverage)) return;
      const nextQuery = toQueryBounds(next);
      coverageRef.current = nextQuery;
      setQueryBounds(nextQuery);
    }, MAP_BOUNDS_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
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
    queryBounds,
    mapRegion,
    viewRegion,
    onBoundsChange,
  };
}
