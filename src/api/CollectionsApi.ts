import { Backend, unwrap } from '~/services/AuthService';

export interface UserCollection {
  id: string;
  user_id: string;
  display_name: string;
  description: string | null;
  cover_image_path: string | null;
  created_at: string;
  updated_at: string;
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
  added_at: string;
}

export interface CollectionDetailRow {
  collection_id: string;
  display_name: string;
  description: string | null;
  cover_image_path: string | null;
  rexes: CollectionRexEntry[];
}

export const CollectionsApi = {
  createCollection: async (params: {
    display_name: string;
    description?: string | null;
    cover_image_path?: string | null;
  }): Promise<UserCollection> => {
    return unwrap(
      await Backend.rpc('create_collection', {
        input_display_name: params.display_name,
        input_description: params.description ?? null,
        input_cover_image_path: params.cover_image_path ?? null,
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

  myCollections: async (): Promise<UserCollection[]> => {
    return unwrap(await Backend.rpc('my_collections'));
  },

  collectionDetail: async (collectionId: string): Promise<CollectionDetailRow> => {
    const rows = unwrap(
      await Backend.rpc('collection_detail', {
        input_collection_id: collectionId,
      }),
    ) as CollectionDetailRow[];
    return rows[0];
  },

  getMySavedRexIds: async (userId: string): Promise<string[]> => {
    const { data, error } = await Backend.from('saved_rexes')
      .select('rex_id')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map((row: any) => row.rex_id);
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
