import { Backend, unwrap } from '~/services/AuthService';

export interface UserCollection {
  id: string;
  user_id: string;
  display_name: string;
  description: string | null;
  cover_image_path: string | null;
  created_at: string;
  updated_at: string;
  rex_count?: number;
  is_my_collection: boolean;
  is_saved?: boolean;
}

export interface UserCollectionRex {
  collection_id: string;
  rex_id: string;
  created_at: string;
}

export interface SavedRex {
  user_id: string;
  rex_id: string;
  created_at: string;
}

export interface CollectionRexEntry {
  rex_id: string;
  place_name: string;
  category_code: string;
  category_name?: string;
  category_icon?: string;
  added_at: string;
  photo_path: string | null;
  location?: string | null;
  score_value_for_money?: number | null;
  rating?: number | null;
  recommender_name?: string | null;
  recommender_handle?: string | null;
}

export interface CollectionDetailRow {
  collection_id: string;
  display_name: string;
  description: string | null;
  cover_image_path: string | null;
  rexes: CollectionRexEntry[];
  is_my_collection: boolean;
  is_saved: boolean;
}

export const CollectionsApi = {
  createCollection: async (params: {
    display_name: string;
    description?: string | null;
    cover_image_path?: string | null;
    visibility?: 'private' | 'shared' | 'public';
  }): Promise<UserCollection> => {
    return unwrap(
      await Backend.rpc('create_collection', {
        input_display_name: params.display_name,
        input_description: params.description ?? null,
        input_cover_image_path: params.cover_image_path ?? null,
        input_visibility: params.visibility ?? 'private',
      }),
    );
  },

  updateCollection: async (params: {
    collection_id: string;
    display_name: string;
    description?: string | null;
    update_cover_image_path?: boolean;
    cover_image_path?: string | null;
  }): Promise<UserCollection> => {
    return unwrap(
      await Backend.rpc('update_collection', {
        input_collection_id: params.collection_id,
        input_display_name: params.display_name,
        input_description: params.description ?? null,
        input_update_cover_image_path: params.update_cover_image_path ?? false,
        input_cover_image_path: params.cover_image_path ?? null,
      }),
    );
  },

  removeRexFromCollection: async (params: {
    collection_id: string;
    rex_id: string;
  }): Promise<void> => {
    const { error } = await Backend.rpc('remove_rex_from_collection', {
      input_collection_id: params.collection_id,
      input_rex_id: params.rex_id,
    });
    if (error) throw error;
  },

  addRexToCollection: async (params: {
    collection_id: string;
    rex_id: string;
  }): Promise<UserCollectionRex> => {
    return unwrap(
      await Backend.rpc('add_rex_to_collection', {
        input_collection_id: params.collection_id,
        input_rex_id: params.rex_id,
      }),
    );
  },

  userCollections: async (userId: string): Promise<UserCollection[]> => {
    return unwrap(await Backend.rpc('user_collections', { input_user_id: userId }));
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
    return Array.isArray(result) ? result as string[] : [];
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

  saveRex: async (_userId: string, rexId: string): Promise<void> => {
    const { error } = await Backend.rpc('save_rex', { input_rex_id: rexId });
    if (error) throw error;
  },

  unsaveRex: async (_userId: string, rexId: string): Promise<void> => {
    const { error } = await Backend.rpc('unsave_rex', { input_rex_id: rexId });
    if (error) throw error;
  },
};