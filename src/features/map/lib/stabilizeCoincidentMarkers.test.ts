import { describe, expect, it } from 'vitest';
import { stabilizeCoincidentMarkers } from '~/features/map/lib/stabilizeCoincidentMarkers';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';

function pin(id: string, lat: number, lng: number): MapMarkerItem {
  return {
    id,
    latitude: lat,
    longitude: lng,
    title: id,
    pinType: 'rex',
    glyph: '•',
    pinColor: '#000',
  };
}

describe('stabilizeCoincidentMarkers', () => {
  it('leaves single markers unchanged', () => {
    const markers = [pin('a', 48, 2)];
    expect(stabilizeCoincidentMarkers(markers)).toEqual(markers);
  });

  it('leaves near-but-distinct places on true coordinates', () => {
    const markers = [pin('a', 43.28, 5.37), pin('b', 43.29, 5.38)];
    const out = stabilizeCoincidentMarkers(markers);
    expect(out).toHaveLength(2);
    expect(out.find((m) => m.id === 'a')).toMatchObject({ latitude: 43.28, longitude: 5.37 });
    expect(out.find((m) => m.id === 'b')).toMatchObject({ latitude: 43.29, longitude: 5.38 });
  });

  it('applies fixed offsets for exact same place, stable by id', () => {
    const lat = 51.5;
    const lng = -0.12;
    const markers = [pin('c', lat, lng), pin('a', lat, lng), pin('b', lat, lng)];
    const first = stabilizeCoincidentMarkers(markers);
    const second = stabilizeCoincidentMarkers([...markers].reverse());
    const byId = (list: MapMarkerItem[]) =>
      Object.fromEntries(list.map((m) => [m.id, `${m.latitude},${m.longitude}`]));
    expect(byId(first)).toEqual(byId(second));
    expect(new Set(first.map((m) => `${m.latitude},${m.longitude}`)).size).toBe(3);
    for (const m of first) {
      expect(Math.hypot(m.latitude - lat, m.longitude - lng)).toBeLessThan(0.0001);
    }
  });
});
