import { MAP_PIN_TYPE } from '~/features/map/config/pins';
import type { MapPinType } from '~/features/map/types/mapPin';

export const MAP_PIN_TYPE_COPY: Record<MapPinType, string> = {
  [MAP_PIN_TYPE.network]: 'Recommended by your network',
  [MAP_PIN_TYPE.rex]: 'Recommended on TruRex',
  [MAP_PIN_TYPE.saved]: 'In your Saved items',
  [MAP_PIN_TYPE.beenHere]: 'You recommended this',
  [MAP_PIN_TYPE.overlap]: 'Multiple connections',
};
