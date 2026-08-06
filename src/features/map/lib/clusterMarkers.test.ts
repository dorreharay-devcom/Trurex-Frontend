import { describe, expect, it } from 'vitest';
import {
  clusterMapMarkers,
  MAP_CLUSTER_MIN_COUNT,
  MAP_CLUSTER_MIN_LAT_DELTA,
  MAP_CLUSTER_MIN_GROUP,
} from '~/features/map/lib/clusterMarkers';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';

function pin(i: number): MapMarkerItem {
  return {
    id: `m${i}`,
    latitude: -33.8 + (i % 5) * 0.001,
    longitude: 151.2 + Math.floor(i / 5) * 0.001,
    title: `t${i}`,
    pinType: 'rex',
    glyph: '•',
    pinColor: '#000',
  };
}

describe('clusterMapMarkers thresholds (show individuals earlier)', () => {
  it('uses conservative density gates', () => {
    expect(MAP_CLUSTER_MIN_COUNT).toBeGreaterThanOrEqual(60);
    expect(MAP_CLUSTER_MIN_LAT_DELTA).toBeGreaterThanOrEqual(0.08);
    expect(MAP_CLUSTER_MIN_GROUP).toBeGreaterThanOrEqual(3);
  });

  it('keeps individuals when below min count', () => {
    const markers = Array.from({ length: 20 }, (_, i) => pin(i));
    expect(clusterMapMarkers(markers, 0.5)).toHaveLength(20);
  });

  it('keeps individuals when still neighborhood-zoomed', () => {
    const markers = Array.from({ length: MAP_CLUSTER_MIN_COUNT + 10 }, (_, i) => pin(i));
    // typical neighborhood ~0.04 — should not cluster
    expect(clusterMapMarkers(markers, 0.04)).toHaveLength(markers.length);
  });

  it('clusters only when dense + city zoom', () => {
    const markers = Array.from({ length: MAP_CLUSTER_MIN_COUNT + 4 }, (_, i) => pin(i));
    const clustered = clusterMapMarkers(markers, 0.2);
    expect(clustered.length).toBeLessThan(markers.length);
  });
});
