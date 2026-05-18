import type { CategoryRatingRead } from '~/types/recommendation/recommendation';

export type RexDetailRow = {
  id: string;
  author_id: string;
  author_display_name: string;
  author_username: string | null;
  author_profile_picture_url: string | null;
  author_relationship_status: 'follows_you' | 'following' | 'trusted' | null;
  category_code: string;
  category_name: string;
  category_icon: string | null;
  category_color: string | null;
  subcategory_code: string;
  subcategory_display_name: string;
  place_id: string | null;
  place_name: string;
  place_location?: string | null;
  description: string | null;
  reason: string | null;
  review: string | null;
  score_value_for_money: number | null;
  quick_tip: string | null;
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
  visibility: 'public' | 'private' | 'circles';
  status: 'active' | 'hidden' | 'removed';
  created_at: string;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  is_saved: boolean;
  tag_slugs: string[];
  photo_paths: string[];
  rex_placeholder_html?: string | null;
};
