import type { MapMarkerItem } from '~/types/map/mapMarker';

const EMPTY_CENTER = { lat: 34.05, lng: -118.25 };

export function googleCenterFromMarkers(markers: MapMarkerItem[]): { lat: number; lng: number } {
  if (markers.length === 0) return EMPTY_CENTER;
  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);
  return {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
  };
}

export function createFitBoundsHandler(markers: MapMarkerItem[]) {
  return (map: google.maps.Map) => {
    if (markers.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((m) => bounds.extend({ lat: m.latitude, lng: m.longitude }));
    map.fitBounds(bounds, 56);
  };
}

export function getInfoWindowOptions(maxWidth: number): google.maps.InfoWindowOptions {
  if (typeof window === 'undefined' || !window.google?.maps) {
    return { maxWidth };
  }
  return {
    maxWidth,
    pixelOffset: new window.google.maps.Size(0, -22),
  };
}
