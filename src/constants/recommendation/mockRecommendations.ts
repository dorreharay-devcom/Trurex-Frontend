import type { Recommendation } from '~/types/recommendation/recommendation';

export const MOCK_RECS: Recommendation[] = [
  {
    id: '1',
    title: 'Nobu Malibu',
    description:
      'Incredible omakase experience with ocean views. The black cod miso is life-changing.',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    categoryId: 'restaurants',
    category: 'Restaurants',
    location: 'Malibu, CA',
    rating: 4.9,
    tags: ['sushi', 'omakase', 'oceanview'],
    user: { name: 'Sarah Chen', handle: '@sarahchen', avatar: 'https://i.pravatar.cc/150?img=47' },
    timeAgo: '2h',
    likes: 84,
    comments: 12,
    saves: 31,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    title: 'Alfred Coffee Melrose',
    description:
      'Best matcha latte in LA. The aesthetic is unmatched and the vibes are immaculate.',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    categoryId: 'cafes-coffee',
    category: 'Cafes',
    location: 'Los Angeles, CA',
    rating: 4.7,
    tags: ['coffee', 'matcha', 'aesthetic'],
    user: { name: 'James Rivera', handle: '@jrivera', avatar: 'https://i.pravatar.cc/150?img=12' },
    timeAgo: '5h',
    likes: 56,
    comments: 8,
    saves: 22,
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    title: 'Chateau Marmont',
    description: 'Timeless Hollywood glamour. Worth every penny for the history alone.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    categoryId: 'hotels-accommodation',
    category: 'Hotels',
    location: 'West Hollywood, CA',
    rating: 4.5,
    tags: ['luxury', 'iconic', 'hollywood'],
    user: { name: 'Mia Torres', handle: '@mia.t', avatar: 'https://i.pravatar.cc/150?img=23' },
    timeAgo: '1d',
    likes: 120,
    comments: 19,
    saves: 67,
    isLiked: false,
    isSaved: true,
  },
];
