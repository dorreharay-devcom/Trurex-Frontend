import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionsApi } from '~/features/collections/api/collectionsApi';
import type { CollectionDetailRow } from '~/features/collections/types/collection';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import { mutationErrorToast } from '~/shared/lib/errors/restriction';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { toastSuccess } from '~/shared/lib/appToast';

export const useAddRexToCollection = () => {
  const queryClient = useQueryClient();
  const mutationFn = withOnlineMutation('Saving to collections', CollectionsApi.addRexToCollection);

  return useMutation({
    mutationFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...COLLECTIONS_QUERY_KEYS.collectionDetail, variables.collection_id],
      });
    },
    onError: mutationErrorToast('Failed to add to collection'),
  });
};

export const useRemoveRexFromCollection = (collectionId: string) => {
  const queryClient = useQueryClient();
  const mutationFn = withOnlineMutation('Updating collections', (rexId: string) =>
    CollectionsApi.removeRexFromCollection({ collection_id: collectionId, rex_id: rexId }),
  );

  return useMutation({
    mutationFn,
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
  const mutationFn = withOnlineMutation(
    'Saving notes',
    (params: { rex_id: string; note: string | null }) =>
      CollectionsApi.updateRexNote({ collection_id: collectionId, ...params }),
  );

  return useMutation({
    mutationFn,
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
