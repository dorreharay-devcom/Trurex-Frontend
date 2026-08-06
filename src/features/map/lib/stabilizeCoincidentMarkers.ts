import type { MapMarkerItem } from '~/features/map/types/mapMarker';

const COINCIDENCE_DECIMALS = 6;
const FIXED_OFFSET_RADIUS_DEG = 0.00003;

function coordKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(COINCIDENCE_DECIMALS)}:${longitude.toFixed(COINCIDENCE_DECIMALS)}`;
}

export function stabilizeCoincidentMarkers(markers: MapMarkerItem[]): MapMarkerItem[] {
  if (markers.length < 2) return markers;

  const buckets = new Map<string, MapMarkerItem[]>();
  for (const marker of markers) {
    const key = coordKey(marker.latitude, marker.longitude);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(marker);
    else buckets.set(key, [marker]);
  }

  const result: MapMarkerItem[] = [];
  for (const group of buckets.values()) {
    if (group.length === 1) {
      result.push(group[0]!);
      continue;
    }

    const sorted = [...group].sort((a, b) => a.id.localeCompare(b.id));
    const n = sorted.length;
    for (let i = 0; i < n; i += 1) {
      const m = sorted[i]!;
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      result.push({
        ...m,
        latitude: m.latitude + FIXED_OFFSET_RADIUS_DEG * Math.sin(angle),
        longitude: m.longitude + FIXED_OFFSET_RADIUS_DEG * Math.cos(angle),
      });
    }
  }
  return result;
}
