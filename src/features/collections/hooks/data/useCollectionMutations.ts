import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionsApi } from '~/features/collections/api/collectionsApi';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import { mutationErrorToast } from '~/shared/lib/errors/restriction';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { toastSuccess } from '~/shared/lib/appToast';

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  const mutationFn = withOnlineMutation('Creating collections', CollectionsApi.createCollection);

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections] });
      toastSuccess('Collection created!');
    },
    onError: mutationErrorToast('Failed to create collection'),
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  const mutationFn = withOnlineMutation('Updating collections', CollectionsApi.updateCollection);

  return useMutation({
    mutationFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections] });
      queryClient.invalidateQueries({
        queryKey: [...COLLECTIONS_QUERY_KEYS.collectionDetail, variables.collection_id],
      });
      toastSuccess('Collection updated!');
    },
    onError: mutationErrorToast('Failed to update collection'),
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  const mutationFn = withOnlineMutation('Deleting collections', CollectionsApi.deleteCollection);

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections] });
      toastSuccess('Collection deleted');
    },
    onError: mutationErrorToast('Failed to delete collection'),
  });
};

export const useSaveCollection = () => {
  const queryClient = useQueryClient();
  const mutationFn = withOnlineMutation('Saving collections', CollectionsApi.saveCollection);

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.mySavedCollections] });
    },
    onError: mutationErrorToast('Failed to save collection'),
  });
};

export const useUnsaveCollection = () => {
  const queryClient = useQueryClient();
  const mutationFn = withOnlineMutation('Updating collections', CollectionsApi.unsaveCollection);

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.mySavedCollections] });
    },
    onError: mutationErrorToast('Failed to unsave collection'),
  });
};
