export const CATEGORY_EMOJI_BY_CODE: Record<string, string> = {
  restaurants: '🍽️',
  cafes_coffee_shops: '☕',
  bars_nightlife: '🍸',
  hotels_accommodation: '🏨',
  experiences_tour_guides: '🗺️',
  medical: '🩺',
  wellness: '🌿',
  beauty_personal_care: '💇',
  home_trades: '🔧',
  creative_professional_services: '🎨',
  business_legal_services: '⚖️',
  spiritual_holistic: '🔮',
  retail_shopping: '🛍️',
  fitness_movement: '🏋️',
  growth_learning: '📚',
  pets: '🐾',
  events_entertainment: '🎭',
  childcare_family: '👶',
  real_estate: '🏠',
};

export function getCategoryEmoji(code: string): string {
  return CATEGORY_EMOJI_BY_CODE[code.trim()] ?? '📍';
}
