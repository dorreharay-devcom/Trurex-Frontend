export type RecommendationOpenOptions = {
  scrollToComments?: boolean;
  scrollToCommentId?: string;
};

export type Recommendation = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  photoPath?: string | null;
  photoPaths?: string[];
  photoCount?: number;
  placeholderColors?: string[] | null;
  categoryId: string;
  category: string;
  categoryIcon?: string | null;
  authorId?: string;
  authorRelationshipStatus?: 'follows_you' | 'following' | 'trusted' | null;
  location?: string;
  locationText?: string | null;
  placeWebsiteUrl?: string | null;
  isOnlinePlace?: boolean | null;
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
};
