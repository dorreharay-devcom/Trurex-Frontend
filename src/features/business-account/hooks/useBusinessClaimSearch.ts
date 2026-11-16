import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DiscoveryApi } from '~/features/discover/api/DiscoveryApi';
import {
  CLAIM_SEARCH_MIN_LENGTH,
  CLAIM_SEARCH_PAGE_SIZE,
} from '~/features/business-account/config/claim';
import { BUSINESS_ACCOUNT_QUERY_KEYS } from '~/features/business-account/config/queryKeys';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';
import { nextPageOffset } from '~/shared/lib/data/guards';

export function useBusinessClaimSearch() {
  const [query, setQuery] = useState('');
  const term = useDebouncedValue(query.trim(), DEFAULT_SEARCH_DEBOUNCE_MS);
  const enabled = term.length >= CLAIM_SEARCH_MIN_LENGTH;

  const search = useInfiniteQuery({
    queryKey: BUSINESS_ACCOUNT_QUERY_KEYS.claimSearch(term),
    queryFn: ({ pageParam }) =>
      DiscoveryApi.searchRexes({
        search_term: term,
        result_limit: CLAIM_SEARCH_PAGE_SIZE,
        result_offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      nextPageOffset(lastPage, allPages, CLAIM_SEARCH_PAGE_SIZE),
    enabled,
  });

  const rows = useMemo(() => search.data?.pages.flat() ?? [], [search.data]);

  return {
    query,
    setQuery,
    rows,
    isIdle: !enabled,
    isSearching: enabled && search.isPending,
    isError: search.isError,
    hasNextPage: search.hasNextPage,
    isFetchingNextPage: search.isFetchingNextPage,
    fetchNextPage: () => void search.fetchNextPage(),
    retry: () => void search.refetch(),
  };
}
