import { useEffect, useRef, type RefObject } from 'react';
import type MapView from 'react-native-maps';
import type { MapMarkerItem, MapRecenterTarget } from '~/features/map/types/mapMarker';

const RECENTER_ZOOM = 14;
const RECENTER_DURATION_MS = 450;
const FIT_EDGE_PADDING = { top: 80, right: 80, bottom: 120, left: 80 };

type Params = {
  mapRef: RefObject<MapView | null>;
  mapReady: boolean;
  recenterTo?: MapRecenterTarget | null;
  markers: MapMarkerItem[];
};

export function useNativeMapRecenter({ mapRef, mapReady, recenterTo, markers }: Params) {
  const markersRef = useRef(markers);
  markersRef.current = markers;

  useEffect(() => {
    if (!mapReady || !recenterTo) return;

    if (recenterTo.fitCoords?.length) {
      mapRef.current?.fitToCoordinates(recenterTo.fitCoords, {
        edgePadding: FIT_EDGE_PADDING,
        animated: true,
      });
      return;
    }

    if (recenterTo.fitMarkers) {
      const current = markersRef.current;
      if (current.length === 0) return;
      mapRef.current?.fitToCoordinates(
        current.map((marker) => ({ latitude: marker.latitude, longitude: marker.longitude })),
        { edgePadding: FIT_EDGE_PADDING, animated: true },
      );
      return;
    }

    mapRef.current?.animateCamera(
      {
        center: { latitude: recenterTo.latitude, longitude: recenterTo.longitude },
        zoom: RECENTER_ZOOM,
      },
      { duration: RECENTER_DURATION_MS },
    );
  }, [mapReady, recenterTo, mapRef]);
}
