import type { Recommendation } from '~/types/recommendation/recommendation';
import type { LatLngBounds } from '~/utils/map/mapRecommendationData';

const MOCK_MAP_REXES: Recommendation[] = [
  {
    id: 'mock-map-1',
    title: 'Bourke Street Bakery',
    description: 'Buttery layers worth the queue.',
    categoryId: 'cafes',
    category: 'Cafes',
    location: '633 Bourke St, Surry Hills NSW',
    latitude: -33.885,
    longitude: 151.211,
    rating: 5,
    scoreValueForMoney: 4,
    authorId: 'mock-author-network',
    user: { name: 'Alex M.', handle: '@alexm', avatar: '' },
    timeAgo: '2w ago',
    likes: 12,
    comments: 2,
    saves: 8,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'mock-map-2',
    title: 'Bondi Icebergs',
    description: 'Iconic pool views.',
    categoryId: 'other',
    category: 'Other',
    location: '1 Notts Ave, Bondi Beach NSW',
    latitude: -33.8945,
    longitude: 151.274,
    rating: 4.5,
    scoreValueForMoney: 3,
    authorId: 'mock-author-network',
    user: { name: 'Sam K.', handle: '@samk', avatar: '' },
    timeAgo: '1mo ago',
    likes: 40,
    comments: 6,
    saves: 15,
    isLiked: false,
    isSaved: true,
  },
  {
    id: 'mock-map-3',
    title: 'Quay Restaurant',
    categoryId: 'restaurants',
    category: 'Restaurants',
    location: 'Upper Level, Overseas Passenger Terminal NSW',
    latitude: -33.857,
    longitude: 151.215,
    rating: 5,
    authorId: 'mock-author-self',
    user: { name: 'You', handle: '@you', avatar: '' },
    timeAgo: '3d ago',
    likes: 3,
    comments: 0,
    saves: 1,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'mock-map-4',
    title: 'Gelato Messina',
    categoryId: 'cafes',
    category: 'Cafes',
    location: '389 Crown St, Surry Hills NSW',
    latitude: -33.884,
    longitude: 151.213,
    rating: 5,
    authorId: 'mock-author-network',
    user: { name: 'Jordan', handle: '@jordan', avatar: '' },
    timeAgo: '5d ago',
    likes: 22,
    comments: 4,
    saves: 10,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'mock-map-5',
    title: 'Taronga Zoo',
    categoryId: 'other',
    category: 'Other',
    location: 'Bradleys Head Rd, Mosman NSW',
    latitude: -33.843,
    longitude: 151.241,
    rating: 4,
    authorId: 'mock-author-network',
    user: { name: 'Riley', handle: '@riley', avatar: '' },
    timeAgo: '1w ago',
    likes: 9,
    comments: 1,
    saves: 3,
    isLiked: false,
    isSaved: false,
  },
];

function inBounds(lat: number, lng: number, b: LatLngBounds): boolean {
  if (lat < b.min_lat || lat > b.max_lat) return false;
  if (b.min_lng <= b.max_lng) {
    return lng >= b.min_lng && lng <= b.max_lng;
  }
  return lng >= b.min_lng || lng <= b.max_lng;
}

export function mockMapRexesForBounds(bounds: LatLngBounds): Recommendation[] {
  const filtered = MOCK_MAP_REXES.filter(
    (r) => r.latitude != null && r.longitude != null && inBounds(r.latitude, r.longitude, bounds),
  );
  return filtered.length > 0 ? filtered : MOCK_MAP_REXES;
}
