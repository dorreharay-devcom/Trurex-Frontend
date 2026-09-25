import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { WishListApi } from '~/features/wish-list/api/wishListApi';
import { WISH_LIST_QUERY_KEYS } from '~/features/wish-list/config/queryKeys';
import { nextPageOffset } from '~/shared/lib/data/guards';

const MY_WISH_LIST_PAGE_LIMIT = 10;

export function useMyWishList() {
  const query = useInfiniteQuery({
    queryKey: WISH_LIST_QUERY_KEYS.mine,
    queryFn: ({ pageParam }) =>
      WishListApi.getMyWishList({
        limit: MY_WISH_LIST_PAGE_LIMIT,
        offset: Number(pageParam ?? 0),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      nextPageOffset(lastPage, allPages, MY_WISH_LIST_PAGE_LIMIT),
  });

  const items = useMemo(() => query.data?.pages.flat() ?? [], [query.data?.pages]);

  const fetchNextPage = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    void query.fetchNextPage();
  }, [query]);

  return {
    items,
    loading: query.isLoading,
    isError: query.isError && items.length === 0,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchNextPageError: query.isFetchNextPageError,
    fetchNextPage,
    retry: () => void query.refetch(),
  };
}

export type MyWishListState = ReturnType<typeof useMyWishList>;
