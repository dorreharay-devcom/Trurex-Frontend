export interface Recommendation {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  photoPath?: string | null;
  categoryId: string;
  category: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  rating?: number | null;
  scoreValueForMoney?: number | null;
  tags?: string[] | null;
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
