import type { MapPinType, PinVisibility } from '~/features/map/types/mapPin';
import { Brand } from '~/shared/theme/Theme';

export const MAP_PIN_TYPE = {
  network: 'network',
  rex: 'rex',
  saved: 'saved',
  beenHere: 'beenHere',
  overlap: 'overlap',
} as const satisfies Record<string, MapPinType>;

export const API_PIN_TYPE = {
  trusted: 'trusted',
  default: 'default',
  saved: 'saved',
  beenThere: 'been_there',
  overlap: 'overlap',
} as const;

export const API_TO_MAP_PIN_TYPE = {
  [API_PIN_TYPE.overlap]: MAP_PIN_TYPE.overlap,
  [API_PIN_TYPE.saved]: MAP_PIN_TYPE.saved,
  [API_PIN_TYPE.beenThere]: MAP_PIN_TYPE.beenHere,
  [API_PIN_TYPE.trusted]: MAP_PIN_TYPE.network,
  [API_PIN_TYPE.default]: MAP_PIN_TYPE.rex,
} as const satisfies Record<(typeof API_PIN_TYPE)[keyof typeof API_PIN_TYPE], MapPinType>;

export const MAP_PIN_REX_COLOR = '#7EC8E8';

export const DEFAULT_PIN_VISIBILITY: PinVisibility = {
  network: true,
  rex: true,
  saved: true,
  beenHere: true,
};

export const MAP_PIN_GLYPH: Record<MapPinType, string> = {
  [MAP_PIN_TYPE.network]: '👥',
  [MAP_PIN_TYPE.rex]: '👤',
  [MAP_PIN_TYPE.saved]: '★',
  [MAP_PIN_TYPE.beenHere]: '✓',
  [MAP_PIN_TYPE.overlap]: '◆',
};

export const MAP_PIN_COLOR: Record<MapPinType, string> = {
  [MAP_PIN_TYPE.network]: Brand.color,
  [MAP_PIN_TYPE.rex]: MAP_PIN_REX_COLOR,
  [MAP_PIN_TYPE.saved]: '#F5A623',
  [MAP_PIN_TYPE.beenHere]: '#249E8B',
  [MAP_PIN_TYPE.overlap]: '#8B5CBF',
};

export const MAP_PIN_GLYPH_COLOR: Record<MapPinType, string> = {
  [MAP_PIN_TYPE.network]: Brand.colorOnBrand,
  [MAP_PIN_TYPE.rex]: '#FFFFFF',
  [MAP_PIN_TYPE.saved]: '#FFFFFF',
  [MAP_PIN_TYPE.beenHere]: '#FFFFFF',
  [MAP_PIN_TYPE.overlap]: '#FFFFFF',
};
