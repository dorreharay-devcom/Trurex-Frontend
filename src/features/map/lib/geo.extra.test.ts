import { describe, expect, it } from 'vitest';
import {
  boundsToRegion,
  expandBounds,
  formatDistanceKm,
  haversineKm,
  regionForMarkers,
  regionToBounds,
  roundBounds,
  sortRecommendationsByDistance,
} from '~/features/map/lib/geo';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';

const bounds = { min_lat: -34, max_lat: -33, min_lng: 150, max_lng: 151 };

describe('geo extras', () => {
  it('converts bounds/region and pads', () => {
    const region = boundsToRegion(bounds);
    expect(region.latitude).toBeCloseTo(-33.5);
    expect(regionToBounds(region).min_lat).toBeCloseTo(bounds.min_lat);
    expect(roundBounds({ ...bounds, min_lat: -33.12345 }, 2).min_lat).toBe(-33.12);
    const expanded = expandBounds(bounds, 0.1);
    expect(expanded.min_lat).toBeLessThan(bounds.min_lat);
  });

  it('distances and marker region', () => {
    const d = haversineKm(
      { latitude: -33.86, longitude: 151.2 },
      { latitude: -33.87, longitude: 151.21 },
    );
    expect(d).toBeGreaterThan(0);
    expect(formatDistanceKm(0.4)).toMatch(/m$/);
    expect(formatDistanceKm(2.34)).toBe('2.3km');
    expect(regionForMarkers([]).latitude).toBeTruthy();
    const markers: MapMarkerItem[] = [
      {
        id: '1',
        latitude: -33.8,
        longitude: 151.2,
        title: 'a',
        pinType: 'rex',
        glyph: '',
        pinColor: '',
      },
      {
        id: '2',
        latitude: -33.9,
        longitude: 151.3,
        title: 'b',
        pinType: 'rex',
        glyph: '',
        pinColor: '',
      },
    ];
    expect(regionForMarkers(markers).latitudeDelta).toBeGreaterThan(0);
  });

  it('sorts recommendations by distance', () => {
    const rows = [
      { id: 'far', latitude: -34, longitude: 152 },
      { id: 'near', latitude: -33.87, longitude: 151.21 },
      { id: 'none', latitude: null, longitude: null },
    ];
    const sorted = sortRecommendationsByDistance(rows, {
      latitude: -33.86,
      longitude: 151.2,
    });
    expect(sorted.map((r) => r.id)).toEqual(['near', 'far', 'none']);
    expect(sortRecommendationsByDistance(rows, null)).toEqual(rows);
  });
});
