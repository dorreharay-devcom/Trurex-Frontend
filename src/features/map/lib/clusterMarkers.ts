import type { MapMarkerItem } from '~/features/map/types/mapMarker';

export const MAP_CLUSTER_MIN_LAT_DELTA = 0.09;
export const MAP_CLUSTER_MIN_COUNT = 72;
export const MAP_CLUSTER_MIN_GROUP = 3;

export function clusterMapMarkers(
  markers: MapMarkerItem[],
  latitudeDelta: number,
): MapMarkerItem[] {
  if (
    markers.length < MAP_CLUSTER_MIN_COUNT ||
    !Number.isFinite(latitudeDelta) ||
    latitudeDelta < MAP_CLUSTER_MIN_LAT_DELTA
  ) {
    return markers;
  }

  const cellSize = Math.max(latitudeDelta / 6, 0.012);
  const buckets = new Map<string, MapMarkerItem[]>();

  for (const marker of markers) {
    const row = Math.floor(marker.latitude / cellSize);
    const col = Math.floor(marker.longitude / cellSize);
    const key = `${row}:${col}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(marker);
    else buckets.set(key, [marker]);
  }

  const result: MapMarkerItem[] = [];
  for (const [key, group] of buckets) {
    if (group.length < MAP_CLUSTER_MIN_GROUP) {
      result.push(...group);
      continue;
    }
    let lat = 0;
    let lng = 0;
    for (const m of group) {
      lat += m.latitude;
      lng += m.longitude;
    }
    const n = group.length;
    result.push({
      id: `cluster:${key}`,
      latitude: lat / n,
      longitude: lng / n,
      title: `${n} Rexes`,
      pinType: group[0]!.pinType,
      glyph: String(n > 99 ? '99+' : n),
      pinColor: group[0]!.pinColor,
      clusterCount: n,
      memberCoords: group.map((m) => ({
        latitude: m.latitude,
        longitude: m.longitude,
      })),
    });
  }
  return result;
}
