import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserRexRequests, myRexRequests } from '~/features/rex-requests/api/rexRequestsApi';
import type { RexRequestRow } from '~/features/rex-requests/api/types';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';
import { nextPageOffset } from '~/shared/lib/data/guards';

const PROFILE_REX_REQUESTS_PAGE_SIZE = 20;

export function useMyRexRequests(
  userId: string | undefined,
  isOwnProfile: boolean,
  postedAsBusiness: boolean | null = null,
) {
  const query = useInfiniteQuery({
    queryKey: [
      ...REX_REQUEST_QUERY_KEYS.profile(userId, isOwnProfile),
      PROFILE_REX_REQUESTS_PAGE_SIZE,
      postedAsBusiness,
    ],
    queryFn: ({ pageParam }) => {
      const params = {
        resultLimit: PROFILE_REX_REQUESTS_PAGE_SIZE,
        resultOffset: Number(pageParam ?? 0),
      };
      return isOwnProfile && postedAsBusiness === null
        ? myRexRequests(params)
        : getUserRexRequests(userId!, { ...params, postedAsBusiness });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: RexRequestRow[], allPages: RexRequestRow[][]) =>
      nextPageOffset(lastPage, allPages, PROFILE_REX_REQUESTS_PAGE_SIZE),
    enabled: !!userId,
  });

  const rows = useMemo(() => query.data?.pages.flat() ?? [], [query.data?.pages]);

  const fetchNextPage = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    void query.fetchNextPage();
  }, [query]);

  return {
    ...query,
    data: rows,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage,
  };
}
