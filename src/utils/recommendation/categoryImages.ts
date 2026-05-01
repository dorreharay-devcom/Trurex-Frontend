import type { ImageSource } from 'expo-image';

const CATEGORY_IMAGES: Partial<Record<string, ImageSource>> = {
  automotive: require('../../../assets/trurex-icons/automotive.svg'),
  bars: require('../../../assets/trurex-icons/bars.svg'),
  cafes: require('../../../assets/trurex-icons/cafes.svg'),
  cafes_coffee_shops: require('../../../assets/trurex-icons/cafes.svg'),
  childcare: require('../../../assets/trurex-icons/childcare.svg'),
  creative_services: require('../../../assets/trurex-icons/creative-services.svg'),
  entertainment: require('../../../assets/trurex-icons/entertainment.svg'),
  fitness: require('../../../assets/trurex-icons/fitness.svg'),
  fitness_movement: require('../../../assets/trurex-icons/fitness.svg'),
  home_and_trade: require('../../../assets/trurex-icons/home-and-trade.svg'),
  hotels: require('../../../assets/trurex-icons/hotels.svg'),
  hotels_accommodation: require('../../../assets/trurex-icons/hotels.svg'),
  medical: require('../../../assets/trurex-icons/medical.svg'),
  personal_beauty: require('../../../assets/trurex-icons/personal-beauty.svg'),
  pets: require('../../../assets/trurex-icons/pets.svg'),
  professional_services: require('../../../assets/trurex-icons/professional-services.svg'),
  real_estate: require('../../../assets/trurex-icons/real-estate.svg'),
  restaurants: require('../../../assets/trurex-icons/restaurant.svg'),
  restaurant: require('../../../assets/trurex-icons/restaurant.svg'),
  retail: require('../../../assets/trurex-icons/retail.svg'),
  spiritual: require('../../../assets/trurex-icons/spiritual.svg'),
  travel_guide: require('../../../assets/trurex-icons/travel-guide.svg'),
  wellness: require('../../../assets/trurex-icons/wellness.svg'),
};

export function getCategoryImage(code: string): ImageSource | null {
  return CATEGORY_IMAGES[code.toLowerCase()] ?? null;
}
