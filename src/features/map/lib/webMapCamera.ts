import { MAP_PIN_GLYPH_COLOR } from '~/features/map/config/pins';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';

export function isValidMapCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
  );
}

const webPinIconUrlCache = new Map<string, string>();

export function createWebMapPinIconUrl(marker: MapMarkerItem, size = 36): string {
  const cacheKey = `${marker.pinType}|${marker.pinColor}|${marker.glyph}|${size}`;
  const cached = webPinIconUrlCache.get(cacheKey);
  if (cached) return cached;

  const topPad = 4;
  const h = size + 10 + topPad;
  const glyphFill = MAP_PIN_GLYPH_COLOR[marker.pinType];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${h}" viewBox="0 0 ${size} ${h}">
      <path d="M${size / 2} ${size + 8 + topPad} C${size / 2} ${size + 8 + topPad} ${size - 2} ${size * 0.6 + topPad} ${size - 2} ${size * 0.42 + topPad}
        A${size * 0.42} ${size * 0.42} 0 0 0 2 ${size * 0.42 + topPad}
        C2 ${size * 0.6 + topPad} ${size / 2} ${size + 8 + topPad} ${size / 2} ${size + 8 + topPad}Z"
        fill="${marker.pinColor}" stroke="white" stroke-width="2"/>
      <text x="${size / 2}" y="${size * 0.45 + topPad}" text-anchor="middle" dominant-baseline="central"
        fill="${glyphFill}" font-size="${size * 0.35}" font-family="system-ui">${marker.glyph}</text>
    </svg>`;
  const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  webPinIconUrlCache.set(cacheKey, url);
  return url;
}

export const WEB_MAP_DEFAULT_CENTER = { lat: -33.8688, lng: 151.2093 } as const;

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
