export interface Recommendation {
  id: string;
  title: string;
  description: string;
  image: string;
  /** Matches `REX_CATEGORIES` id for feed filtering */
  categoryId: string;
  category: string;
  location?: string;
  rating?: number;
  tags: string[];
  user: { name: string; handle: string; avatar: string };
  timeAgo: string;
  likes: number;
  comments: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
}
