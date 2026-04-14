export type RexCategory = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  apiCode: string;
};

export const REAL_ESTATE_CATEGORY_ID = 'real-estate';

export const REX_CATEGORIES: RexCategory[] = [
  {
    id: 'restaurants',
    label: 'Restaurants',
    emoji: '🍽️',
    color: '#f04a1e',
    apiCode: 'restaurants',
  },
  {
    id: 'cafes-coffee',
    label: 'Cafes & Coffee Shops',
    emoji: '☕',
    color: '#df7a11',
    apiCode: 'cafes_coffee_shops',
  },
  {
    id: 'bars-nightlife',
    label: 'Bars & Nightlife',
    emoji: '🍸',
    color: '#7a57d4',
    apiCode: 'bars_nightlife',
  },
  {
    id: 'hotels-accommodation',
    label: 'Hotels & Accommodation',
    emoji: '🏨',
    color: '#2e86de',
    apiCode: 'hotels_accommodation',
  },
  {
    id: 'experiences-tours',
    label: 'Experiences & Tour Guides',
    emoji: '🗺️',
    color: '#df3b7e',
    apiCode: 'experiences_tours',
  },
  { id: 'medical', label: 'Medical', emoji: '🩺', color: '#dc2626', apiCode: 'medical' },
  { id: 'wellness', label: 'Wellness', emoji: '🌿', color: '#16a34a', apiCode: 'wellness' },
  {
    id: 'beauty',
    label: 'Beauty & Personal Care',
    emoji: '💇',
    color: '#db2777',
    apiCode: 'beauty_personal_care',
  },
  {
    id: 'home-trades',
    label: 'Home & Trades',
    emoji: '🔧',
    color: '#ca8a04',
    apiCode: 'home_trades',
  },
  {
    id: 'creative-pro',
    label: 'Creative Professional Services',
    emoji: '🎨',
    color: '#9333ea',
    apiCode: 'creative_professional',
  },
  {
    id: 'business-legal',
    label: 'Business & Legal Services',
    emoji: '⚖️',
    color: '#475569',
    apiCode: 'business_legal',
  },
  {
    id: 'spiritual-holistic',
    label: 'Spiritual & Holistic',
    emoji: '🔮',
    color: '#7c3aed',
    apiCode: 'spiritual_holistic',
  },
  {
    id: 'retail-shopping',
    label: 'Retail & Shopping',
    emoji: '🛍️',
    color: '#ea580c',
    apiCode: 'retail_shopping',
  },
  {
    id: 'fitness-sports',
    label: 'Fitness & Sports',
    emoji: '🏋️',
    color: '#059669',
    apiCode: 'fitness_sports',
  },
  {
    id: 'growth-learning',
    label: 'Growth & Learning',
    emoji: '📚',
    color: '#2aa66b',
    apiCode: 'growth_learning',
  },
  { id: 'pets', label: 'Pets', emoji: '🐾', color: '#a16207', apiCode: 'pets' },
  {
    id: REAL_ESTATE_CATEGORY_ID,
    label: 'Real Estate',
    emoji: '🏠',
    color: '#0d9488',
    apiCode: 'real_estate',
  },
];

export function getRexCategoryById(id: string): RexCategory | undefined {
  return REX_CATEGORIES.find((c) => c.id === id);
}

export function getRexCategoryApiCode(categoryId: string | null): string | null {
  if (!categoryId) return null;
  return getRexCategoryById(categoryId)?.apiCode ?? null;
}

export function getRexCategoryByApiCode(apiCode: string): RexCategory | undefined {
  return REX_CATEGORIES.find((c) => c.apiCode === apiCode);
}
