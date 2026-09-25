import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { WishListApi } from '~/features/wish-list/api/wishListApi';
import { WISH_LIST_QUERY_KEYS } from '~/features/wish-list/config/queryKeys';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';
import { nextPageOffset } from '~/shared/lib/data/guards';

const PRODUCT_BRAND_REXES_PAGE_LIMIT = 20;

export function useProductBrandRexes() {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, DEFAULT_SEARCH_DEBOUNCE_MS).trim();

  const result = useInfiniteQuery({
    queryKey: WISH_LIST_QUERY_KEYS.productBrandRexes(debounced),
    queryFn: ({ pageParam }) =>
      WishListApi.getProductBrandRexes({
        search: debounced || null,
        limit: PRODUCT_BRAND_REXES_PAGE_LIMIT,
        offset: Number(pageParam ?? 0),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      nextPageOffset(lastPage, allPages, PRODUCT_BRAND_REXES_PAGE_LIMIT),
    // Browse-by-default feed: unlike a search-gated list, this stays enabled even
    // with an empty query so it shows results before the user types anything.
    enabled: true,
  });

  const rows = useMemo(() => result.data?.pages.flat() ?? [], [result.data?.pages]);

  const fetchNextPage = useCallback(() => {
    if (!result.hasNextPage || result.isFetchingNextPage) return;
    void result.fetchNextPage();
  }, [result]);

  return {
    query,
    setQuery,
    rows,
    isFetching: result.isFetching,
    isError: result.isError && rows.length === 0,
    hasNextPage: Boolean(result.hasNextPage),
    isFetchingNextPage: result.isFetchingNextPage,
    isFetchNextPageError: result.isFetchNextPageError,
    fetchNextPage,
    retry: () => void result.refetch(),
  };
}

export type ProductBrandRexesState = ReturnType<typeof useProductBrandRexes>;
