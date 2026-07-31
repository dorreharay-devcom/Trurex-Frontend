export type CollectionVisibility = 'private' | 'shared' | 'public';

export type UserCollection = {
  id: string;
  user_id: string;
  display_name: string;
  description: string | null;
  cover_image_path: string | null;
  first_rex_photo_path?: string | null;
  share_token?: string | null;
  visibility?: CollectionVisibility;
  created_at: string;
  updated_at: string;
  rex_count?: number;
  total_count?: number;
  is_my_collection: boolean;
  is_saved?: boolean;
};

export type UserCollectionRex = {
  collection_id: string;
  rex_id: string;
  created_at: string;
};

export type CollectionRexEntry = {
  rex_id: string;
  place_name: string;
  category_code: string;
  category_name?: string;
  category_icon?: string;
  added_at: string;
  photo_path: string | null;
  placeholder_colors?: string[] | null;
  location?: string | null;
  is_online_place?: boolean | null;
  place_website_url?: string | null;
  score_value_for_money?: number | null;
  overall_rating?: number | null;
  rating?: number | null;
  recommender_name?: string | null;
  recommender_handle?: string | null;
  note?: string | null;
};

export type CollectionDetailRow = {
  collection_id: string;
  display_name: string;
  description: string | null;
  cover_image_path: string | null;
  visibility?: CollectionVisibility;
  rexes: CollectionRexEntry[];
  is_my_collection: boolean;
  is_saved: boolean;
};

export type CreateCollectionInput = {
  display_name: string;
  description?: string | null;
  cover_image_path?: string | null;
  visibility?: CollectionVisibility;
};

export type UpdateCollectionInput = CreateCollectionInput & {
  collection_id: string;
  update_cover_image_path?: boolean;
};

export type CollectionRexRef = {
  collection_id: string;
  rex_id: string;
};

export type EditableCollection = {
  id: string;
  display_name: string;
  description: string | null;
  cover_image_path: string | null;
  visibility?: CollectionVisibility;
};
