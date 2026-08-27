export type DiscoverQueryParams = {
  category_filter?: string | null;
  tag_filters?: string[] | null;
  result_limit?: number;
  result_offset?: number;
};

export type SearchRexesParams = {
  search_term?: string | null;
  category_filter?: string | null;
  value_for_money_filters?: number[] | null;
  quality_filter?: number | null;
  created_from?: string | null;
  created_to?: string | null;
  result_limit?: number;
  result_offset?: number;
};

export type DiscoverCollectionsFeedParams = {
  result_limit?: number;
  result_offset?: number;
  search_query?: string | null;
};

export type DiscoverCollectionRow = {
  id: string;
  user_id: string;
  display_name: string;
  description: string | null;
  cover_image_path: string | null;
  first_rex_photo_path: string | null;
  visibility: 'public';
  shared_to_feed_at: string;
  created_at: string;
  rex_count: number;
  is_saved: boolean;
  owner_display_name: string;
  owner_handle: string;
  owner_avatar_url: string | null;
  total_count: number;
};
