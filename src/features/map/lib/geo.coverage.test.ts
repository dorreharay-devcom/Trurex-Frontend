import { describe, expect, it } from 'vitest';
import { isViewportCoveredBy, type LatLngBounds } from '~/features/map/lib/geo';

const coverage: LatLngBounds = {
  min_lat: -34,
  max_lat: -33,
  min_lng: 150,
  max_lng: 151,
};

describe('isViewportCoveredBy', () => {
  it('returns true when view is strictly inside coverage', () => {
    const view: LatLngBounds = {
      min_lat: -33.8,
      max_lat: -33.2,
      min_lng: 150.2,
      max_lng: 150.8,
    };
    expect(isViewportCoveredBy(view, coverage)).toBe(true);
  });

  it('returns false when view extends outside coverage', () => {
    const view: LatLngBounds = {
      min_lat: -34.5,
      max_lat: -33.2,
      min_lng: 150.2,
      max_lng: 150.8,
    };
    expect(isViewportCoveredBy(view, coverage)).toBe(false);
  });
});
