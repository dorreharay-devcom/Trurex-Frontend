import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { MapApi } from '~/features/map/api/mapApi';
import { MAP_QUERY_STALE_TIME_MS } from '~/features/map/config/mapUi';
import { filterRecommendationsByRexTitle } from '~/features/map/lib/filters';
import type { LatLngBounds } from '~/features/map/lib/geo';
import type { MapPinRow } from '~/features/map/types/mapPinRow';
import type { Recommendation } from '~/shared/types/recommendation';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

const EMPTY_PINS: MapPinRow[] = [];
const EMPTY_RECS: Recommendation[] = [];

type Params = {
  bounds: LatLngBounds | null;
  searchTerm: string;
  needCardRows: boolean;
};

function filterPinRowsByPlaceName(rows: MapPinRow[], rawQuery: string): MapPinRow[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => r.place_name.toLowerCase().includes(q));
}

export function useMapBoundsData({ bounds, searchTerm, needCardRows }: Params) {
  const hasBounds = bounds != null;
  const queryKeyBase = hasBounds
    ? ([bounds.min_lat, bounds.max_lat, bounds.min_lng, bounds.max_lng] as const)
    : (['idle'] as const);

  const boundsParams = useMemo(() => {
    if (!bounds) return null;
    return {
      min_lat: bounds.min_lat,
      max_lat: bounds.max_lat,
      min_lng: bounds.min_lng,
      max_lng: bounds.max_lng,
    };
  }, [bounds]);

  const {
    data: serverPins,
    isPending: pinsPending,
    isError: pinsError,
    refetch: refetchPins,
  } = useQuery({
    queryKey: [...REX_QUERY_KEYS.mapRexPins, ...queryKeyBase],
    queryFn: async ({ signal }) => {
      const rows = await MapApi.mapRexPins(boundsParams!);
      signal.throwIfAborted();
      return rows;
    },
    enabled: hasBounds && boundsParams != null,
    placeholderData: keepPreviousData,
    staleTime: MAP_QUERY_STALE_TIME_MS,
  });

  const {
    data: serverRecs,
    isPending: rexesPending,
    isError: rexesError,
    refetch: refetchRexes,
  } = useQuery({
    queryKey: [...REX_QUERY_KEYS.mapRexesInBounds, ...queryKeyBase],
    queryFn: async ({ signal }) => {
      const rows = await MapApi.mapRexesInBounds(boundsParams!);
      signal.throwIfAborted();
      return rows;
    },
    enabled: hasBounds && boundsParams != null && needCardRows,
    placeholderData: keepPreviousData,
    staleTime: MAP_QUERY_STALE_TIME_MS,
  });

  const pinSource = serverPins ?? EMPTY_PINS;
  const recSource = serverRecs ?? EMPTY_RECS;

  const fetchedRecs = useMemo(
    () => (searchTerm.trim() ? filterRecommendationsByRexTitle(recSource, searchTerm) : recSource),
    [recSource, searchTerm],
  );

  const pinRows = useMemo(
    () => (searchTerm.trim() ? filterPinRowsByPlaceName(pinSource, searchTerm) : pinSource),
    [pinSource, searchTerm],
  );

  const refetch = useCallback(() => {
    void refetchPins();
    if (needCardRows) void refetchRexes();
  }, [refetchPins, refetchRexes, needCardRows]);

  const isLoading = hasBounds && (pinsPending || (needCardRows && rexesPending));

  return {
    fetchedRecs,
    pinRows,
    isLoading,
    isError: pinsError || (needCardRows && rexesError),
    refetch,
  };
}
