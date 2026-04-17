export const MAP_FILTER_CATEGORIES: { id: string; label: string; emoji: string; color: string }[] =
  [
    { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', color: '#f04a1e' },
    { id: 'cafes', label: 'Cafes', emoji: '☕', color: '#df7a11' },
    { id: 'hotels', label: 'Hotels', emoji: '🏨', color: '#2e86de' },
    { id: 'bars', label: 'Bars', emoji: '🍸', color: '#7a57d4' },
  ];

export const MAP_VIEW_HEIGHT = 440;
export const MAP_VIEW_MIN_HEIGHT = 360;

/**
 * Inset for floating controls on the map (search, legend, layers, locate).
 * Use as position offsets only — do not pad the map tile container.
 */
export const MAP_ACTION_INSET = 20;
/** Layers FAB sits above the locate control (locate height 40 + gap). */
export const MAP_LAYER_ABOVE_LOCATE = 52;

export const WEB_INFO_CARD_MAX_W = 320;
export const WEB_INFO_IMAGE_H = 118;

export const GOOGLE_ORANGE_PIN_ICON = 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
