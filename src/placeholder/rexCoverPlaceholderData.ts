export type RexCoverPlaceholderFooter = 'dark' | 'cream' | 'slate';

export type RexCoverPlaceholderRow = {
  codes: readonly string[];
  displayLabel: string;
  backgroundColor: string;
  footer: RexCoverPlaceholderFooter;
  titleColor: string;
  subtitleColor: string;
  artIndex: number;
};

export const REX_COVER_PLACEHOLDER_ROWS: readonly RexCoverPlaceholderRow[] = [
  {
    codes: ['automotive'],
    displayLabel: 'Automotive',
    backgroundColor: '#000000',
    footer: 'dark',
    titleColor: '#B7C7CF',
    subtitleColor: '#EFEDE2',
    artIndex: 0,
  },
  {
    codes: ['bars'],
    displayLabel: 'Bars & Nightlife',
    backgroundColor: '#3E4446',
    footer: 'dark',
    titleColor: '#F5E050',
    subtitleColor: '#EFEDE2',
    artIndex: 1,
  },
  {
    codes: ['personal_beauty', 'beauty'],
    displayLabel: 'Beauty & Personal Care',
    backgroundColor: '#EFEDE2',
    footer: 'cream',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 2,
  },
  {
    codes: ['professional_services', 'business', 'legal'],
    displayLabel: 'Business & Legal',
    backgroundColor: '#000000',
    footer: 'dark',
    titleColor: '#F5E050',
    subtitleColor: '#EFEDE2',
    artIndex: 3,
  },
  {
    codes: ['cafes', 'cafes_coffee_shops'],
    displayLabel: 'Cafes & Coffee Shops',
    backgroundColor: '#EFEDE2',
    footer: 'cream',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 4,
  },
  {
    codes: ['childcare'],
    displayLabel: 'Childcare & Family',
    backgroundColor: '#B7C7CF',
    footer: 'slate',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 5,
  },
  {
    codes: ['creative_services'],
    displayLabel: 'Creative Services',
    backgroundColor: '#3E4446',
    footer: 'dark',
    titleColor: '#F5E050',
    subtitleColor: '#EFEDE2',
    artIndex: 6,
  },
  {
    codes: ['entertainment', 'events'],
    displayLabel: 'Events & Entertainment',
    backgroundColor: '#000000',
    footer: 'dark',
    titleColor: '#B7C7CF',
    subtitleColor: '#EFEDE2',
    artIndex: 7,
  },
  {
    codes: ['travel_guide', 'experiences', 'tours'],
    displayLabel: 'Experiences & Tours',
    backgroundColor: '#EFEDE2',
    footer: 'cream',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 8,
  },
  {
    codes: ['fitness', 'fitness_movement'],
    displayLabel: 'Fitness & Movement',
    backgroundColor: '#3E4446',
    footer: 'dark',
    titleColor: '#B7C7CF',
    subtitleColor: '#EFEDE2',
    artIndex: 9,
  },
  {
    codes: ['growth_learning', 'education', 'learning'],
    displayLabel: 'Growth & Learning',
    backgroundColor: '#000000',
    footer: 'dark',
    titleColor: '#F5E050',
    subtitleColor: '#EFEDE2',
    artIndex: 0,
  },
  {
    codes: ['home_and_trade', 'home'],
    displayLabel: 'Home & Trades',
    backgroundColor: '#EFEDE2',
    footer: 'cream',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 1,
  },
  {
    codes: ['hotels', 'hotels_accommodation'],
    displayLabel: 'Hotels & Accommodation',
    backgroundColor: '#B7C7CF',
    footer: 'slate',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 2,
  },
  {
    codes: ['medical'],
    displayLabel: 'Medical',
    backgroundColor: '#000000',
    footer: 'dark',
    titleColor: '#B7C7CF',
    subtitleColor: '#EFEDE2',
    artIndex: 3,
  },
  {
    codes: ['pets', 'pet'],
    displayLabel: 'Pets',
    backgroundColor: '#EFEDE2',
    footer: 'cream',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 4,
  },
  {
    codes: ['real_estate'],
    displayLabel: 'Real Estate',
    backgroundColor: '#3E4446',
    footer: 'dark',
    titleColor: '#F5E050',
    subtitleColor: '#EFEDE2',
    artIndex: 5,
  },
  {
    codes: ['restaurants', 'restaurant'],
    displayLabel: 'Restaurants',
    backgroundColor: '#000000',
    footer: 'dark',
    titleColor: '#F5E050',
    subtitleColor: '#EFEDE2',
    artIndex: 6,
  },
  {
    codes: ['retail', 'shopping'],
    displayLabel: 'Retail & Shopping',
    backgroundColor: '#EFEDE2',
    footer: 'cream',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 7,
  },
  {
    codes: ['spiritual'],
    displayLabel: 'Spiritual & Holistic',
    backgroundColor: '#3E4446',
    footer: 'dark',
    titleColor: '#B7C7CF',
    subtitleColor: '#EFEDE2',
    artIndex: 8,
  },
  {
    codes: ['wellness'],
    displayLabel: 'Wellness',
    backgroundColor: '#B7C7CF',
    footer: 'slate',
    titleColor: '#3E4446',
    subtitleColor: '#000000',
    artIndex: 9,
  },
] as const;

function hashCategoryId(categoryId: string): number {
  let h = 0;
  for (let i = 0; i < categoryId.length; i++) {
    h = (h * 31 + categoryId.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function resolveRexCoverPlaceholderRow(
  categoryId: string | null | undefined,
): RexCoverPlaceholderRow {
  const c = (categoryId ?? 'all').toLowerCase().trim();
  const hit = REX_COVER_PLACEHOLDER_ROWS.find((row) => row.codes.some((code) => c === code));
  if (hit) return hit;
  return REX_COVER_PLACEHOLDER_ROWS[hashCategoryId(c) % REX_COVER_PLACEHOLDER_ROWS.length]!;
}
