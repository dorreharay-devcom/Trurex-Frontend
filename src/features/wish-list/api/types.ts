export type WishListItemRow = {
  id: string;
  brand_name: string;
  product_name: string | null;
  size: string | null;
  colour: string | null;
  note: string | null;
  tags: string[];
  photo_path: string | null;
  source_rex_id: string | null;
  source_rex_place_name?: string | null;
  source_rex_review?: string | null;
  created_at: string;
  updated_at?: string;
};

export type AddToWishListParams = {
  brandName: string;
  productName?: string | null;
  size?: string | null;
  colour?: string | null;
  note?: string | null;
  tags?: string[];
  photoPath?: string | null;
  sourceRexId?: string | null;
};

export type UpdateWishListItemParams = {
  id: string;
  brandName: string;
  productName: string | null;
  size: string | null;
  colour: string | null;
  note: string | null;
  tags: string[];
  photoPath: string | null;
};

export type WishListListParams = {
  limit?: number;
  offset?: number;
};

export type ProductBrandRexRow = {
  id: string;
  author_id: string;
  author_handle: string | null;
  author_display_name: string;
  author_avatar_url: string | null;
  brand_name: string;
  product_name: string | null;
  review: string | null;
  score_overall: number | null;
  question_answers: Record<string, unknown>;
  tags: string[];
  photo_paths: string[];
  created_at: string;
};

export type ProductBrandRexesParams = {
  search?: string | null;
  limit?: number;
  offset?: number;
};
