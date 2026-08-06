import { useMemo } from 'react';
import {
  useMyCollections,
  useMySavedCollections,
} from '~/features/collections/hooks/data/useCollectionQueries';
import { useSavedRexes } from '~/features/collections/hooks/data/useSavedRexes';
import { useAuth } from '~/features/auth/providers';

export function useGemsData(searchQuery: string) {
  const { user } = useAuth();

  const mine = useMyCollections(user?.id);
  const saved = useMySavedCollections();
  const uncollectedQuery = useSavedRexes({
    uncollected: true,
    search_term: searchQuery.trim() || null,
  });

  const collections = useMemo(() => {
    const all = [...(mine.data ?? []), ...(saved.data ?? [])];
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter((c) => c.display_name.toLowerCase().includes(q));
  }, [mine.data, saved.data, searchQuery]);

  const uncollectedItems = uncollectedQuery.data ?? [];
  const uncollectedLoading = uncollectedQuery.isLoading;
  const collectionsLoading = mine.isLoading || saved.isLoading;

  return {
    collections: {
      items: collections,
      loading: collectionsLoading,
      isError: (mine.isError || saved.isError) && collections.length === 0 && !collectionsLoading,
      hasNextPage: mine.hasNextPage,
      isFetchingNextPage: mine.isFetchingNextPage,
      isFetchNextPageError: mine.isFetchNextPageError,
      fetchNextPage: mine.fetchNextPage,
      retry: () => {
        void mine.refetch();
        void saved.refetch();
      },
    },
    uncollected: {
      items: uncollectedLoading ? [] : uncollectedItems,
      loading: uncollectedLoading,
      isError: uncollectedQuery.isError && uncollectedItems.length === 0,
      hasNextPage: uncollectedQuery.hasNextPage,
      isFetchingNextPage: uncollectedQuery.isFetchingNextPage,
      isFetchNextPageError: uncollectedQuery.isFetchNextPageError,
      fetchNextPage: uncollectedQuery.fetchNextPage,
      retry: () => void uncollectedQuery.refetch(),
    },
  };
}

export type GemsCollectionsState = ReturnType<typeof useGemsData>['collections'];
export type GemsUncollectedState = ReturnType<typeof useGemsData>['uncollected'];
