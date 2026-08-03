import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { MapApi } from '~/features/map/api/mapApi';
import type { LatLngBounds } from '~/features/map/lib/geo';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

type Params = {
  bounds: LatLngBounds;
  searchTerm: string;
};

export function useMapBoundsData({ bounds, searchTerm }: Params) {
  const term = searchTerm.length > 0 ? searchTerm : null;

  const queryKeyBase = [
    bounds.min_lat,
    bounds.max_lat,
    bounds.min_lng,
    bounds.max_lng,
    term ?? '',
  ] as const;

  const boundsParams = useMemo(() => ({ ...bounds, search_term: term }), [bounds, term]);

  const {
    data: fetchedRecs = [],
    isLoading: rexesLoading,
    isError,
    refetch: refetchRexes,
  } = useQuery({
    queryKey: [...REX_QUERY_KEYS.mapRexesInBounds, ...queryKeyBase],
    queryFn: () => MapApi.mapRexesInBounds(boundsParams),
    placeholderData: keepPreviousData,
  });

  const {
    data: pinRows = [],
    isLoading: pinsLoading,
    refetch: refetchPins,
  } = useQuery({
    queryKey: [...REX_QUERY_KEYS.mapRexPins, ...queryKeyBase],
    queryFn: () => MapApi.mapRexPins(boundsParams),
    placeholderData: keepPreviousData,
  });

  const refetch = useCallback(() => {
    void refetchRexes();
    void refetchPins();
  }, [refetchRexes, refetchPins]);

  return {
    fetchedRecs,
    pinRows,
    isLoading: rexesLoading || pinsLoading,
    isError,
    refetch,
  };
}
