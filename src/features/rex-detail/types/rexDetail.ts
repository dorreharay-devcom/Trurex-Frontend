import type { RexVisibility } from '~/features/rex-create/lib/sharing';
import type { RelationshipStatus } from '~/shared/config/relationshipStatus';

export type CategoryRatingRead = {
  label: string;
  display_label: string;
  description: string | null;
  score: number | null;
};

export type RexDetailRow = {
  id: string;
  author_id: string;
  author_display_name: string;
  author_username: string | null;
  author_profile_picture_url: string | null;
  author_relationship_status: RelationshipStatus | null;
  category_code: string;
  category_name: string;
  category_icon: string | null;
  category_color: string | null;
  subcategory_code: string;
  subcategory_display_name: string;
  place_id: string | null;
  place_name: string;
  is_online_place?: boolean | null;
  place_website_url?: string | null;
  location_text?: string | null;
  place_location?: string | null;
  description: string | null;
  reason: string | null;
  review: string | null;
  score_value_for_money: number | null;
  must_know: string | null;
  quick_tip?: string | null;
  category_ratings: Record<string, CategoryRatingRead>;
  question_answers: Record<
    string,
    {
      label: string;
      description: string | null;
      selected_code: string;
      selected_label: string;
    }
  >;
  visibility: RexVisibility;
  status: 'active' | 'hidden' | 'removed';
  created_at: string;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  is_saved: boolean;
  tag_slugs: string[];
  photo_paths: string[];
  placeholder_colors?: string[] | null;
  overall_rating: number | null;
};

export type RexForEditRow = {
  id: string;
  category_code: string;
  subcategory_code: string;
  place_id: string | null;
  place_name: string;
  is_online_place: boolean;
  place_website_url: string | null;
  location_text: string | null;
  description: string | null;
  reason: string | null;
  review: string | null;
  score_value_for_money: number | null;
  must_know: string | null;
  category_ratings: Record<string, CategoryRatingRead>;
  question_answers: Record<string, string>;
  visibility: RexVisibility;
  circle_ids: string[];
  tag_slugs: string[];
  photo_paths: string[];
};
