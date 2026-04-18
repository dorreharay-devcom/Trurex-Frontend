import type { MapMarkerItem } from '~/types/map/mapMarker';

export function isValidMapCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
  );
}

export function createWebMapPinIconUrl(marker: MapMarkerItem, size = 36): string {
  const h = size + 10;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${h}" viewBox="0 0 ${size} ${h}">
      <path d="M${size / 2} ${size + 8} C${size / 2} ${size + 8} ${size - 2} ${size * 0.6} ${size - 2} ${size * 0.42}
        A${size * 0.42} ${size * 0.42} 0 0 0 2 ${size * 0.42}
        C2 ${size * 0.6} ${size / 2} ${size + 8} ${size / 2} ${size + 8}Z"
        fill="${marker.pinColor}" stroke="white" stroke-width="2"/>
      <text x="${size / 2}" y="${size * 0.45}" text-anchor="middle" dominant-baseline="central"
        fill="white" font-size="${size * 0.35}" font-family="system-ui">${marker.glyph}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const WEB_MAP_DEFAULT_CENTER = { lat: -33.8688, lng: 151.2093 } as const;

export function googleCenterFromMarkers(markers: MapMarkerItem[]): { lat: number; lng: number } {
  if (markers.length === 0) return { ...WEB_MAP_DEFAULT_CENTER };
  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);
  return {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
  };
}

export function createFitBoundsHandler(markers: MapMarkerItem[]) {
  return (map: google.maps.Map) => {
    const valid = markers.filter((m) => isValidMapCoordinate(m.latitude, m.longitude));
    if (valid.length === 0) return;
    if (valid.length === 1) {
      const m = valid[0];
      map.setCenter({ lat: m.latitude, lng: m.longitude });
      map.setZoom(14);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    valid.forEach((m) => bounds.extend({ lat: m.latitude, lng: m.longitude }));
    map.fitBounds(bounds, 56);
  };
}

export function triggerGoogleMapResize(map: google.maps.Map | null): void {
  if (typeof window === 'undefined' || !map || !window.google?.maps?.event) return;
  window.google.maps.event.trigger(map, 'resize');
}
