export interface Recommendation {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  category: string;
  location?: string;
  latitude?: number;
  longitude?: number;
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

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  count: number;
  image: string;
}
