import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionsApi } from '~/features/collections/api/collectionsApi';
import type {
  CollectionDetailRow,
  CollectionRexRef,
} from '~/features/collections/types/collection';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import { mutationErrorToast } from '~/shared/lib/mutationErrorToast';
import { toastSuccess } from '~/utils/appToast';

export const useAddRexToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CollectionRexRef) => CollectionsApi.addRexToCollection(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...COLLECTIONS_QUERY_KEYS.collectionDetail, variables.collection_id],
      });
    },
  });
};

export const useRemoveRexFromCollection = (collectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rexId: string) =>
      CollectionsApi.removeRexFromCollection({ collection_id: collectionId, rex_id: rexId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...COLLECTIONS_QUERY_KEYS.collectionDetail, collectionId],
      });
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections] });
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.mySavedCollections] });
      toastSuccess('Removed from collection');
    },
    onError: mutationErrorToast('Failed to remove'),
  });
};

export const useUpdateCollectionRexNote = (collectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { rex_id: string; note: string | null }) =>
      CollectionsApi.updateRexNote({ collection_id: collectionId, ...params }),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<CollectionDetailRow>(
        [...COLLECTIONS_QUERY_KEYS.collectionDetail, collectionId],
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            rexes: prev.rexes.map((r) =>
              r.rex_id === variables.rex_id ? { ...r, note: variables.note } : r,
            ),
          };
        },
      );
    },
    onError: mutationErrorToast('Failed to save note'),
  });
};
