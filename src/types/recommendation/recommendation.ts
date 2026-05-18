export type CategoryRatingRead = {
  label: string;
  display_label: string;
  description: string | null;
  score: number | null;
};

export type FeedListCardRow = {
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
  place_name: string;
  description: string | null;
  reason: string | null;
  review: string | null;
  score_value_for_money: number | null;
  quick_tip: string | null;
  visibility: 'public' | 'private' | 'circles';
  created_at: string;
  save_count: number;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  is_saved: boolean;
  photo_path: string | null;
  category_ratings: Record<string, CategoryRatingRead>;
};

export type RecommendationOpenOptions = {
  scrollToComments?: boolean;
};

export interface Recommendation {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  photoPath?: string | null;
  rexPlaceholderHtml?: string | null;
  photoPaths?: string[];
  photoCount?: number;
  categoryId: string;
  category: string;
  categoryIcon?: string | null;
  authorId?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  rating?: number | null;
  scoreValueForMoney?: number | null;
  tags?: string[] | null;
  savedAt?: string | null;
  user?: { name: string; handle: string; avatar: string } | null;
  timeAgo: string;
  likes: number;
  comments: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  count: number;
  image: string;
}
