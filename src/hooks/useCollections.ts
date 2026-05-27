import { useMemo, useCallback } from 'react';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CollectionsApi,
  UserCollection,
  CollectionDetailRow,
  CollectionVisibility,
} from '~/api/CollectionsApi';
import { toastSuccess, toastError } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';

const USER_COLLECTIONS_PAGE_LIMIT = 50;

export const useMyCollections = (userId?: string) => {
  const query = useInfiniteQuery({
    queryKey: ['my-collections', userId, USER_COLLECTIONS_PAGE_LIMIT],
    queryFn: ({ pageParam }) =>
      CollectionsApi.userCollections(userId!, {
        result_limit: USER_COLLECTIONS_PAGE_LIMIT,
        result_offset: Number(pageParam ?? 0),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage[0]?.total_count;
      const nextOffset = allPages.length * USER_COLLECTIONS_PAGE_LIMIT;
      if (typeof totalCount === 'number') {
        return nextOffset < totalCount ? nextOffset : undefined;
      }
      return lastPage.length === USER_COLLECTIONS_PAGE_LIMIT ? nextOffset : undefined;
    },
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
    queryKey: ['my-saved-collections'],
    queryFn: () => CollectionsApi.mySavedCollections(),
  });
};

export const useSaveCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collectionId: string) => CollectionsApi.saveCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-saved-collections'] });
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Failed to save collection', unknownErrorMessage(error, 'Try again.'));
    },
  });
};

export const useUnsaveCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collectionId: string) => CollectionsApi.unsaveCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-saved-collections'] });
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Failed to unsave collection', unknownErrorMessage(error, 'Try again.'));
    },
  });
};

export const useCollectionDetail = (collectionId: string) => {
  return useQuery<CollectionDetailRow>({
    queryKey: ['collection-detail', collectionId],
    queryFn: () => CollectionsApi.collectionDetail(collectionId),
    enabled: !!collectionId,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      display_name: string;
      description?: string | null;
      cover_image_path?: string | null;
      visibility?: 'private' | 'shared' | 'public';
    }) => CollectionsApi.createCollection(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      toastSuccess('Collection created!');
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Failed to create collection', unknownErrorMessage(error, 'Try again.'));
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      collection_id: string;
      display_name: string;
      description?: string | null;
      update_cover_image_path?: boolean;
      cover_image_path?: string | null;
      visibility?: CollectionVisibility;
    }) => CollectionsApi.updateCollection(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection-detail', variables.collection_id] });
      toastSuccess('Collection updated!');
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Failed to update collection', unknownErrorMessage(error, 'Try again.'));
    },
  });
};

export const useAddRexToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { collection_id: string; rex_id: string }) =>
      CollectionsApi.addRexToCollection(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collection-detail', variables.collection_id] });
      toastSuccess('Added to collection!');
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Failed to add to collection', unknownErrorMessage(error, 'Try again.'));
    },
  });
};

export const useRemoveRexFromCollection = (collectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rexId: string) =>
      CollectionsApi.removeRexFromCollection({ collection_id: collectionId, rex_id: rexId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-detail', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      queryClient.invalidateQueries({ queryKey: ['my-saved-collections'] });
      toastSuccess('Removed from collection');
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Failed to remove', unknownErrorMessage(error, 'Try again.'));
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => CollectionsApi.deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      toastSuccess('Collection deleted');
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Failed to delete collection', unknownErrorMessage(error, 'Try again.'));
    },
  });
};

export const useUpdateCollectionRexNote = (collectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { rex_id: string; note: string | null }) =>
      CollectionsApi.updateRexNote({ collection_id: collectionId, ...params }),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<CollectionDetailRow>(['collection-detail', collectionId], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          rexes: prev.rexes.map((r) =>
            r.rex_id === variables.rex_id ? { ...r, note: variables.note } : r,
          ),
        };
      });
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Failed to save note', unknownErrorMessage(error, 'Try again.'));
    },
  });
};

export const useToggleSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      rexId,
      isSaved,
    }: {
      userId: string;
      rexId: string;
      isSaved: boolean;
    }) => {
      if (isSaved) {
        await CollectionsApi.unsaveRex(userId, rexId);
      } else {
        await CollectionsApi.saveRex(userId, rexId);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-saved-ids', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['my-saved', variables.userId] });
      toastSuccess(variables.isSaved ? 'Removed from bookmarks' : 'Added to bookmarks');
    },
    onError: (error: unknown) => {
      if (didAccountFrozenMutationToast(error)) return;
      toastError('Action failed', unknownErrorMessage(error, 'Try again.'));
    },
  });
};
