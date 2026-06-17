import { Brand } from '~/theme/Theme';

/** Default/public Rex pins — soft light blue, distinct from trusted grey-blue. */
export const MAP_PIN_REX_COLOR = '#7EC8E8';

export type MapPinType = 'network' | 'rex' | 'saved' | 'beenHere' | 'overlap';

export type PinVisibility = {
  network: boolean;
  rex: boolean;
  saved: boolean;
  beenHere: boolean;
};

export const DEFAULT_PIN_VISIBILITY: PinVisibility = {
  network: true,
  rex: true,
  saved: true,
  beenHere: true,
};

export const MAP_PIN_GLYPH: Record<MapPinType, string> = {
  network: '👥',
  rex: '👤',
  saved: '★',
  beenHere: '✓',
  overlap: '◆',
};

export const MAP_PIN_COLOR: Record<MapPinType, string> = {
  network: Brand.color,
  rex: MAP_PIN_REX_COLOR,
  saved: 'hsl(37, 92%, 50%)',
  beenHere: 'hsl(168, 60%, 35%)',
  overlap: 'hsl(270, 50%, 50%)',
};

export const MAP_PIN_GLYPH_COLOR: Record<MapPinType, string> = {
  network: Brand.colorOnBrand,
  rex: '#FFFFFF',
  saved: '#FFFFFF',
  beenHere: '#FFFFFF',
  overlap: '#FFFFFF',
};
