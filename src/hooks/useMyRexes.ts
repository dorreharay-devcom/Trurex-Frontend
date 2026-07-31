import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Backend, unwrap } from '~/shared/api/client';
import { mapDiscoverFeedRowSafe } from '~/api/mapDiscoverFeed';
import type { Recommendation } from '~/shared/types/recommendation';

const MY_REXES_PAGE_SIZE = 20;

export const useMyRexes = (userId?: string) => {
  const pageSize = MY_REXES_PAGE_SIZE;
  const query = useInfiniteQuery({
    queryKey: ['my-rexes', userId, pageSize],
    queryFn: async ({ pageParam }) => {
      const raw = unwrap(
        await Backend.rpc('user_rexes', {
          input_user_id: userId,
          result_limit: pageSize,
          result_offset: Number(pageParam ?? 0),
        }),
      );
      if (!Array.isArray(raw)) return [] as Recommendation[];
      return raw.flatMap((row) => {
        const rec = mapDiscoverFeedRowSafe(row);
        return rec ? [rec] : [];
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === pageSize ? allPages.length * pageSize : undefined,
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
};
