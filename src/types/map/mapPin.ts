import { Brand } from '~/theme/Theme';

export type MapPinType = 'network' | 'saved' | 'beenHere' | 'overlap';

export type PinVisibility = {
  network: boolean;
  saved: boolean;
  beenHere: boolean;
};

export const DEFAULT_PIN_VISIBILITY: PinVisibility = {
  network: true,
  saved: true,
  beenHere: true,
};

export const MAP_PIN_GLYPH: Record<MapPinType, string> = {
  network: '👥',
  saved: '★',
  beenHere: '✓',
  overlap: '◆',
};

export const MAP_PIN_COLOR: Record<MapPinType, string> = {
  network: Brand.color,
  saved: 'hsl(37, 92%, 50%)',
  beenHere: 'hsl(168, 60%, 35%)',
  overlap: 'hsl(270, 50%, 50%)',
};

export const MAP_PIN_GLYPH_COLOR: Record<MapPinType, string> = {
  network: Brand.colorOnBrand,
  saved: '#FFFFFF',
  beenHere: '#FFFFFF',
  overlap: '#FFFFFF',
};
