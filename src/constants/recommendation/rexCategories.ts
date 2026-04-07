/** Full TruRex category list — used on the feed pills and New Rex category step grid. */
export type RexCategory = {
  id: string;
  label: string;
  emoji: string;
  /** Accent for selected state (borders / tint), same pattern as CategoryPills */
  color: string;
};

export const REX_CATEGORIES: RexCategory[] = [
  { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', color: '#f04a1e' },
  { id: 'cafes-coffee', label: 'Cafes & Coffee Shops', emoji: '☕', color: '#df7a11' },
  { id: 'bars-nightlife', label: 'Bars & Nightlife', emoji: '🍸', color: '#7a57d4' },
  { id: 'hotels-accommodation', label: 'Hotels & Accommodation', emoji: '🏨', color: '#2e86de' },
  { id: 'experiences-tours', label: 'Experiences & Tour Guides', emoji: '🗺️', color: '#df3b7e' },
  { id: 'medical', label: 'Medical', emoji: '🩺', color: '#dc2626' },
  { id: 'wellness', label: 'Wellness', emoji: '🌿', color: '#16a34a' },
  { id: 'beauty', label: 'Beauty & Personal Care', emoji: '💇', color: '#db2777' },
  { id: 'home-trades', label: 'Home & Trades', emoji: '🔧', color: '#ca8a04' },
  { id: 'creative-pro', label: 'Creative Professional Services', emoji: '🎨', color: '#9333ea' },
  { id: 'business-legal', label: 'Business & Legal Services', emoji: '⚖️', color: '#475569' },
  { id: 'spiritual-holistic', label: 'Spiritual & Holistic', emoji: '🔮', color: '#7c3aed' },
  { id: 'retail-shopping', label: 'Retail & Shopping', emoji: '🛍️', color: '#ea580c' },
  { id: 'fitness-sports', label: 'Fitness & Sports', emoji: '🏋️', color: '#059669' },
  { id: 'growth-learning', label: 'Growth & Learning', emoji: '📚', color: '#2aa66b' },
  { id: 'pets', label: 'Pets', emoji: '🐾', color: '#a16207' },
];

export function getRexCategoryById(id: string): RexCategory | undefined {
  return REX_CATEGORIES.find((c) => c.id === id);
}
