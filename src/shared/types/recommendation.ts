import type { RelationshipStatus } from '~/shared/config/relationshipStatus';

export type RecommendationOpenOptions = {
  scrollToComments?: boolean;
  scrollToCommentId?: string;
};

export type RecommendationAuthor = {
  name: string;
  handle: string;
  avatar: string;
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
  authorRelationshipStatus?: RelationshipStatus | null;
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
  createdAt?: string | null;
  user?: RecommendationAuthor | null;
  likes: number;
  comments: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
};
