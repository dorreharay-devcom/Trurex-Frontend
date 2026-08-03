import type { Region } from 'react-native-maps';
import type { LatLngBounds } from '~/features/map/lib/geo';
import type { MapMarkerItem, MapRecenterTarget } from '~/features/map/types/mapMarker';

export type MarkerMapProps = {
  markers: MapMarkerItem[];
  selectedId: string | null;
  onMarkerPress: (id: string) => void;
  initialRegion?: Region;
  onRegionChangeComplete?: (bounds: LatLngBounds, region: Region) => void;
  recenterTo?: MapRecenterTarget | null;
};
