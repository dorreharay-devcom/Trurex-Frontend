import { useCallback, useMemo } from 'react';
import { skipToken, useInfiniteQuery } from '@tanstack/react-query';
import { fetchPlaceRexes } from '~/features/business/api/placeRexesApi';
import { nextPageOffset } from '~/shared/lib/data/guards';
import { PLACE_REXES_QUERY_KEY } from '~/shared/config/queryKeys';
import type { PlaceRef } from '~/shared/types/placeRef';

const PLACE_REXES_PAGE_LIMIT = 20;

export function usePlaceRexesList(ref: PlaceRef | null, networkOnly: boolean, enabled: boolean) {
  const result = useInfiniteQuery({
    queryKey: PLACE_REXES_QUERY_KEY(ref, networkOnly),
    queryFn:
      ref && enabled
        ? ({ pageParam }) =>
            fetchPlaceRexes({
              ref,
              networkOnly,
              limit: PLACE_REXES_PAGE_LIMIT,
              offset: pageParam,
            })
        : skipToken,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      nextPageOffset(lastPage, allPages, PLACE_REXES_PAGE_LIMIT),
  });

  const rows = useMemo(() => result.data?.pages.flat() ?? [], [result.data?.pages]);

  const fetchNextPage = useCallback(() => {
    if (!result.hasNextPage || result.isFetchingNextPage) return;
    void result.fetchNextPage();
  }, [result]);

  return {
    rows,
    isInitialLoading: result.isPending,
    isError: result.isError && rows.length === 0,
    hasNextPage: Boolean(result.hasNextPage),
    isFetchingNextPage: result.isFetchingNextPage,
    fetchNextPage,
    retry: () => void result.refetch(),
  };
}
