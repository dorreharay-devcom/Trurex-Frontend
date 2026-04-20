import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Backend } from '~/services/AuthService';
import { CollectionsApi, UserCollection, UserCollectionRex, CollectionDetailRow } from '~/api/CollectionsApi';
import { toastSuccess, toastError } from '~/utils/appToast';

export const useMyCollections = () => {
  return useQuery<UserCollection[]>({
    queryKey: ['my-collections'],
    queryFn: () => CollectionsApi.myCollections(),
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
    }) => CollectionsApi.createCollection(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      toastSuccess('Collection created!');
    },
    onError: (error: any) => {
      toastError('Failed to create collection', error.message);
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
    }) => CollectionsApi.updateCollection(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection-detail', variables.collection_id] });
      toastSuccess('Collection updated!');
    },
    onError: (error: any) => {
      toastError('Failed to update collection', error.message);
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
    onError: (error: any) => {
      toastError('Failed to add to collection', error.message);
    },
  });
};

export const useRemoveRexFromCollection = (collectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rexId: string) =>
      Backend.from('user_collection_rexes')
        .delete()
        .eq('collection_id', collectionId)
        .eq('rex_id', rexId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-detail', collectionId] });
      toastSuccess('Removed from collection');
    },
    onError: (error: any) => {
      toastError('Failed to remove', error.message);
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) =>
      Backend.from('user_collections').delete().eq('id', collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      toastSuccess('Collection deleted');
    },
    onError: (error: any) => {
      toastError('Failed to delete collection', error.message);
    },
  });
};

export const useSavedRexIds = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['my-saved-ids', userId],
    queryFn: () => CollectionsApi.getMySavedRexIds(userId!),
    enabled: !!userId,
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
    onError: (error: any) => {
      toastError('Action failed', error.message);
    },
  });
};
