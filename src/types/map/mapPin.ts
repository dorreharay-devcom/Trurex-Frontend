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
  network: 'hsl(20, 90%, 48%)',
  saved: 'hsl(37, 92%, 50%)',
  beenHere: 'hsl(168, 60%, 35%)',
  overlap: 'hsl(270, 50%, 50%)',
};
