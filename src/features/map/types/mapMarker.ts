import type { MapPinType } from '~/features/map/types/mapPin';

export type MapMarkerItem = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  subtitle?: string;
  pinType: MapPinType;
  glyph: string;
  pinColor: string;
  imageUrl?: string;
  imageStoragePath?: string;
};

export type MapRecenterTarget = {
  latitude: number;
  longitude: number;
  nonce: number;
  fitMarkers?: boolean;
};
