export type CategoryQuestion = {
  code: string;
  display_label: string;
  description: string | null;
  is_required: boolean;
  sort_order: number;
  options: { code: string; label: string; sort_order: number }[];
};

export type CategoryRatingDimension = {
  code: string;
  display_label: string;
  description: string | null;
  sort_order: number;
};

export type CategoryTagOption = {
  slug: string;
  label: string;
  sort_order: number;
  tag_group?: string | null;
};

export type CategorySubcategoryConfig = {
  code: string;
  display_name: string;
  sort_order: number;
  questions: CategoryQuestion[];
  rating_dimensions: CategoryRatingDimension[];
  tag_options: CategoryTagOption[];
};

export type CategoryCreateConfig = {
  code: string;
  display_name: string;
  questions: CategoryQuestion[];
  rating_dimensions: CategoryRatingDimension[];
  tag_options: CategoryTagOption[];
  subcategories: CategorySubcategoryConfig[];
};

export type DbCategoryRow = {
  id: string;
  code: string;
  display_name: string;
  sort_order: number;
  icon?: string | null;
};

export type CreateRexRpcParams = {
  p_category_code: string;
  p_subcategory_code?: string;
  p_place_name: string;
  p_review?: string | null;
  p_description?: string | null;
  p_reason?: string | null;
  p_visibility: 'public' | 'private' | 'circles';
  circle_ids?: string[] | null;
  tag_names: string[];
  photo_paths: string[] | null;
  p_linked_place_id?: string | null;
  p_quick_tip?: string | null;
  p_category_ratings: Record<string, number>;
  p_question_answers: Record<string, string>;
  p_score_value_for_money?: number | null;
};
