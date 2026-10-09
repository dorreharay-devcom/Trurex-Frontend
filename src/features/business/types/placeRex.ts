import type { CategoryRatingRead } from '~/features/rex-detail/types/rexDetail';

export type PlaceRexRow = {
  id: string;
  author_id: string;
  author_display_name: string;
  author_handle: string;
  author_avatar_url: string | null;
  author_tier_icon: string | null;
  is_from_network: boolean;
  review: string | null;
  score_value_for_money: number | null;
  category_ratings: Record<string, CategoryRatingRead>;
  tag_slugs: string[];
  photo_paths: string[];
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  is_saved: boolean;
  created_at: string;
};
