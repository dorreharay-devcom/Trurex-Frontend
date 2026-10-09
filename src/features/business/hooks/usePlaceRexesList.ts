import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPlaceRexes } from '~/features/business/api/placeRexesApi';
import { nextPageOffset } from '~/shared/lib/data/guards';
import { PLACE_REXES_QUERY_KEY } from '~/shared/config/queryKeys';

const PLACE_REXES_PAGE_LIMIT = 20;

export function usePlaceRexesList(rexId: string, networkOnly: boolean, enabled: boolean) {
  const result = useInfiniteQuery({
    queryKey: PLACE_REXES_QUERY_KEY(rexId, networkOnly),
    queryFn: ({ pageParam }) =>
      fetchPlaceRexes({
        rexId,
        networkOnly,
        limit: PLACE_REXES_PAGE_LIMIT,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      nextPageOffset(lastPage, allPages, PLACE_REXES_PAGE_LIMIT),
    enabled: enabled && rexId.length > 0,
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
