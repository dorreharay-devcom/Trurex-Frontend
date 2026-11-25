import { useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { CollectionsApi } from '~/features/collections/api/collectionsApi';
import type { CollectionDetailRow, UserCollection } from '~/features/collections/types/collection';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';

const USER_COLLECTIONS_PAGE_LIMIT = 50;

function hasMoreCollections(lastPage: UserCollection[], nextOffset: number): boolean {
  const totalCount = lastPage[0]?.total_count;
  if (totalCount != null) return nextOffset < totalCount;
  return lastPage.length === USER_COLLECTIONS_PAGE_LIMIT;
}

function nextCollectionsOffset(
  lastPage: UserCollection[],
  allPages: UserCollection[][],
): number | undefined {
  const nextOffset = allPages.length * USER_COLLECTIONS_PAGE_LIMIT;
  if (!hasMoreCollections(lastPage, nextOffset)) return undefined;
  return nextOffset;
}

export const useMyCollections = (userId?: string) => {
  const query = useInfiniteQuery({
    queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections, userId, USER_COLLECTIONS_PAGE_LIMIT],
    queryFn: ({ pageParam }) =>
      CollectionsApi.userCollections(userId!, {
        result_limit: USER_COLLECTIONS_PAGE_LIMIT,
        result_offset: Number(pageParam ?? 0),
      }),
    initialPageParam: 0,
    getNextPageParam: nextCollectionsOffset,
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

export const useMySavedCollections = () => {
  return useQuery<UserCollection[]>({
    queryKey: [...COLLECTIONS_QUERY_KEYS.mySavedCollections],
    queryFn: () => CollectionsApi.mySavedCollections(),
  });
};

export const useCollectionDetail = (collectionId: string) => {
  return useQuery<CollectionDetailRow>({
    queryKey: [...COLLECTIONS_QUERY_KEYS.collectionDetail, collectionId],
    queryFn: () => CollectionsApi.collectionDetail(collectionId),
    enabled: !!collectionId,
  });
};
