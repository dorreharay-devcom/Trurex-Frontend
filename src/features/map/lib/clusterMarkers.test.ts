import { describe, expect, it } from 'vitest';
import { clusterMapMarkers } from '~/features/map/lib/clusterMarkers';
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

describe('clusterMapMarkers (legacy helper; map no longer clusters/hides rexes)', () => {
  it('keeps individuals under density gates', () => {
    const markers = Array.from({ length: 20 }, (_, i) => pin(i));
    expect(clusterMapMarkers(markers, 0.5)).toHaveLength(20);
  });
});
