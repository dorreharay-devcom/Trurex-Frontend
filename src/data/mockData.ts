import type { ProfileData } from '~/types/profile';
import type { Recommendation } from '~/types/recommendation/recommendation';

export const currentUser: ProfileData = {
  displayName: 'Alex Morgan',
  handle: '@alexmorgan',
  bio: 'Curator of good taste. Restaurants, books, travel — I rex it all.',
  location: 'Los Angeles, CA',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
  trustScore: 92,
  rexCount: 73,
  followers: 312,
  following: 156,
  currently: {
    binging: 'The Bear',
    listening: 'Mk.gee',
    reading: 'The Comfort of Things',
  },
};

export const collections = [
  {
    id: '1',
    name: 'Date Night',
    emoji: '🕯️',
    count: 8,
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    name: 'Coffee Spots',
    emoji: '☕',
    count: 5,
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    name: 'LA Eats',
    emoji: '🍽️',
    count: 12,
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
  },
];

export const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Nobu Malibu',
    description: 'The best sushi with the best view. A Malibu staple.',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    categoryId: 'restaurants',
    category: 'Restaurants',
    location: 'Malibu, CA',
    latitude: 34.0029,
    longitude: -118.8062,
    rating: 4.9,
    tags: ['sushi', 'view', 'upscale'],
    user: {
      name: 'Alex Morgan',
      handle: '@alexmorgan',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
    timeAgo: '2h',
    likes: 42,
    comments: 5,
    saves: 12,
    isLiked: false,
    isSaved: true,
  },
  {
    id: '2',
    title: 'Alfred Coffee',
    description: 'But first, coffee. The best vanilla latte in town.',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    categoryId: 'cafes_coffee_shops',
    category: 'Cafes',
    location: 'Los Angeles, CA',
    latitude: 34.0834,
    longitude: -118.353,
    rating: 4.7,
    tags: ['coffee', 'aesthetic', 'la'],
    user: {
      name: 'Alex Morgan',
      handle: '@alexmorgan',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
    timeAgo: '5h',
    likes: 28,
    comments: 2,
    saves: 8,
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    title: 'Chateau Marmont',
    description: 'Old Hollywood glamour at its finest.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    categoryId: 'hotels_accommodation',
    category: 'Hotels',
    location: 'West Hollywood, CA',
    latitude: 34.098,
    longitude: -118.3687,
    rating: 4.5,
    tags: ['hollywood', 'hotel', 'luxury'],
    user: {
      name: 'Alex Morgan',
      handle: '@alexmorgan',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
    timeAgo: '1d',
    likes: 15,
    comments: 3,
    saves: 24,
    isLiked: false,
    isSaved: true,
  },
  {
    id: '4',
    title: 'Attaboy',
    description: 'No menu, just great cocktails tailored to your taste.',
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
    categoryId: 'bars_nightlife',
    category: 'Bars',
    location: 'New York, NY',
    latitude: 40.7182,
    longitude: -73.9884,
    rating: 4.8,
    tags: ['cocktails', 'speakeasy', 'ny'],
    user: {
      name: 'Alex Morgan',
      handle: '@alexmorgan',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
    timeAgo: '2d',
    likes: 56,
    comments: 7,
    saves: 31,
    isLiked: true,
    isSaved: true,
  },
];
