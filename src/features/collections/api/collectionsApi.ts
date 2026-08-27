import { Backend, unwrap } from '~/shared/api/client';
import type {
  CollectionDetailRow,
  CollectionRexRef,
  CreateCollectionInput,
  UpdateCollectionInput,
  UserCollection,
  UserCollectionRex,
} from '~/features/collections/types/collection';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';

export const CollectionsApi = {
  createCollection: async (params: CreateCollectionInput): Promise<UserCollection> => {
    return unwrap(
      await Backend.rpc('create_collection', {
        input_display_name: params.display_name,
        input_description: params.description ?? null,
        input_cover_image_path: params.cover_image_path ?? null,
        input_visibility: params.visibility ?? 'private',
      }),
    );
  },

  updateCollection: async (params: UpdateCollectionInput): Promise<UserCollection> => {
    return unwrap(
      await Backend.rpc('update_collection', {
        input_collection_id: params.collection_id,
        input_display_name: params.display_name,
        input_description: params.description ?? null,
        input_update_cover_image_path: params.update_cover_image_path ?? false,
        input_cover_image_path: params.cover_image_path ?? null,
        ...(params.visibility ? { input_visibility: params.visibility } : {}),
      }),
    );
  },

  removeRexFromCollection: async (params: CollectionRexRef): Promise<void> => {
    throwRpcIfFailed(
      await Backend.rpc('remove_rex_from_collection', {
        input_collection_id: params.collection_id,
        input_rex_id: params.rex_id,
      }),
    );
  },

  addRexToCollection: async (params: CollectionRexRef): Promise<UserCollectionRex> => {
    return unwrap(
      await Backend.rpc('add_rex_to_collection', {
        input_collection_id: params.collection_id,
        input_rex_id: params.rex_id,
      }),
    );
  },

  userCollections: async (
    userId: string,
    params: { result_limit?: number; result_offset?: number } = {},
  ): Promise<UserCollection[]> => {
    return unwrap(
      await Backend.rpc('user_collections', {
        input_user_id: userId,
        result_limit: params.result_limit ?? 50,
        result_offset: params.result_offset ?? 0,
      }),
    );
  },

  saveCollection: async (collectionId: string): Promise<void> => {
    unwrap(await Backend.rpc('save_collection', { input_collection_id: collectionId }));
  },

  unsaveCollection: async (collectionId: string): Promise<void> => {
    unwrap(await Backend.rpc('unsave_collection', { input_collection_id: collectionId }));
  },

  mySavedCollections: async (): Promise<UserCollection[]> => {
    return unwrap(await Backend.rpc('my_saved_collections'));
  },

  myCollectionIdsForRex: async (rexId: string): Promise<string[]> => {
    const result = unwrap(await Backend.rpc('my_collection_ids_for_rex', { input_rex_id: rexId }));
    return Array.isArray(result) ? (result as string[]) : [];
  },

  collectionDetail: async (collectionId: string): Promise<CollectionDetailRow> => {
    const rows = unwrap(
      await Backend.rpc('collection_detail', {
        input_collection_id: collectionId,
      }),
    ) as CollectionDetailRow[];
    return rows[0];
  },

  deleteCollection: async (collectionId: string): Promise<void> => {
    unwrap(await Backend.rpc('delete_collection', { input_collection_id: collectionId }));
  },

  shareCollectionToFeed: async (collectionId: string): Promise<void> => {
    throwRpcIfFailed(
      await Backend.rpc('share_collection_to_feed', { input_collection_id: collectionId }),
    );
  },

  saveRex: async (_userId: string, rexId: string): Promise<void> => {
    throwRpcIfFailed(await Backend.rpc('save_rex', { input_rex_id: rexId }));
  },

  unsaveRex: async (_userId: string, rexId: string): Promise<void> => {
    throwRpcIfFailed(await Backend.rpc('unsave_rex', { input_rex_id: rexId }));
  },

  updateRexNote: async (params: {
    collection_id: string;
    rex_id: string;
    note: string | null;
  }): Promise<void> => {
    throwRpcIfFailed(
      await Backend.rpc('update_collection_rex_note', {
        input_collection_id: params.collection_id,
        input_rex_id: params.rex_id,
        input_note: params.note,
      }),
    );
  },
};
