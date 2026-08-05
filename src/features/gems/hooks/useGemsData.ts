import { useMemo } from 'react';
import {
  useMyCollections,
  useMySavedCollections,
} from '~/features/collections/hooks/data/useCollectionQueries';
import { useSavedRexes } from '~/features/collections/hooks/data/useSavedRexes';
import { useAuth } from '~/features/auth/providers';

export function useGemsData(searchQuery: string) {
  const { user } = useAuth();

  const {
    data: myCollections = [],
    isLoading: loadingMine,
    hasNextPage: hasNextCollectionsPage,
    isFetchingNextPage: isFetchingNextCollectionsPage,
    fetchNextPage: fetchNextCollectionsPage,
  } = useMyCollections(user?.id);
  const { data: savedCollections = [], isLoading: loadingSavedCollections } =
    useMySavedCollections();

  const {
    data: uncollectedRexes = [],
    isLoading: loadingUncollected,
    hasNextPage: hasNextUncollectedPage,
    isFetchingNextPage: isFetchingNextUncollectedPage,
    fetchNextPage: fetchNextUncollectedPage,
  } = useSavedRexes({ uncollected: true, search_term: searchQuery.trim() || null });

  const collections = useMemo(() => {
    const all = [...myCollections, ...savedCollections];
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter((c) => c.display_name.toLowerCase().includes(q));
  }, [myCollections, savedCollections, searchQuery]);

  return {
    collections: {
      items: collections,
      loading: loadingMine || loadingSavedCollections,
      hasNextPage: hasNextCollectionsPage,
      isFetchingNextPage: isFetchingNextCollectionsPage,
      fetchNextPage: fetchNextCollectionsPage,
    },
    uncollected: {
      items: loadingUncollected ? [] : uncollectedRexes,
      loading: loadingUncollected,
      hasNextPage: hasNextUncollectedPage,
      isFetchingNextPage: isFetchingNextUncollectedPage,
      fetchNextPage: fetchNextUncollectedPage,
    },
  };
}

export type GemsCollectionsState = ReturnType<typeof useGemsData>['collections'];
export type GemsUncollectedState = ReturnType<typeof useGemsData>['uncollected'];
