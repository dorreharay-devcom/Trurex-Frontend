import { describe, expect, it } from 'vitest';
import {
  apiPinTypeToMapPinType,
  deriveMapPinType,
  filterRecommendationsByPinLayers,
  isOwnRecommendation,
  mapAuthorRecommendedLabel,
  mapPinRowFromOptimisticRec,
  mapPinRowToMapMarkerItem,
  mapPinTypeForRecommendation,
  pinRowPassesLayerVisibility,
} from '~/features/map/lib/pinTypes';
import { API_PIN_TYPE, MAP_PIN_TYPE } from '~/features/map/config/pins';
import type { Recommendation } from '~/shared/types/recommendation';
import type { MapPinRow } from '~/features/map/types/mapPinRow';

const rec = (partial: Partial<Recommendation>): Recommendation => ({
  id: 'r1',
  title: 'Place',
  categoryId: 'all',
  category: '',
  createdAt: null,
  likes: 0,
  comments: 0,
  saves: 0,
  isLiked: false,
  isSaved: false,
  ...partial,
});

const layersAll = { network: true, rex: true, saved: true, beenHere: true };

describe('pinTypes', () => {
  it('derives pin types and ownership', () => {
    expect(isOwnRecommendation(rec({ authorId: 'u1' }), 'u1')).toBe(true);
    expect(isOwnRecommendation(rec({ authorId: 'u1' }), 'u2')).toBe(false);
    expect(deriveMapPinType(rec({ authorId: 'u1', isSaved: true }), 'u1')).toBe(
      MAP_PIN_TYPE.overlap,
    );
    expect(deriveMapPinType(rec({ authorId: 'u1' }), 'u1')).toBe(MAP_PIN_TYPE.beenHere);
    expect(deriveMapPinType(rec({ isSaved: true }), 'u1')).toBe(MAP_PIN_TYPE.saved);
    expect(
      deriveMapPinType(rec({ authorRelationshipStatus: API_PIN_TYPE.trusted as never }), null),
    ).toBe(MAP_PIN_TYPE.network);
    expect(deriveMapPinType(rec({}), null)).toBe(MAP_PIN_TYPE.rex);
    expect(
      mapPinTypeForRecommendation(rec({ id: 'x' }), new Map([['x', MAP_PIN_TYPE.saved]]), null),
    ).toBe(MAP_PIN_TYPE.saved);
  });

  it('maps api rows and filters layers', () => {
    expect(apiPinTypeToMapPinType(API_PIN_TYPE.saved, { is_saved: false })).toBe(
      MAP_PIN_TYPE.saved,
    );
    expect(apiPinTypeToMapPinType(null, { is_saved: true })).toBe(MAP_PIN_TYPE.saved);
    expect(apiPinTypeToMapPinType(null, { is_saved: false })).toBe(MAP_PIN_TYPE.rex);

    const row: MapPinRow = {
      rex_id: 'r1',
      place_id: 'p1',
      place_name: 'Cafe',
      place_rex_author_count: 1,
      latitude: 1,
      longitude: 2,
      category_code: 'food',
      category_name: 'Food',
      category_icon: null,
      category_color: null,
      is_saved: false,
      pin_type: API_PIN_TYPE.default,
    };
    expect(mapPinRowToMapMarkerItem(row).title).toBe('Cafe');
    expect(pinRowPassesLayerVisibility(row, { ...layersAll, rex: false })).toBe(false);

    const filtered = filterRecommendationsByPinLayers(
      [rec({ id: 'a', isSaved: true }), rec({ id: 'b' })],
      { network: false, rex: false, saved: true, beenHere: false },
      null,
    );
    expect(filtered.map((r) => r.id)).toEqual(['a']);
  });

  it('author recommended labels', () => {
    expect(mapAuthorRecommendedLabel({ name: 'Ann' })).toBe('Ann recommended it');
    expect(mapAuthorRecommendedLabel({ handle: 'bob' })).toBe('@bob recommended it');
    expect(mapAuthorRecommendedLabel({})).toBeNull();
  });

  it('builds optimistic pin rows from recs with coords', () => {
    expect(
      mapPinRowFromOptimisticRec(
        rec({ id: 'r1', title: 'Cafe', latitude: -33.8, longitude: 151.2 }),
      ),
    ).toMatchObject({
      rex_id: 'r1',
      latitude: -33.8,
      longitude: 151.2,
      place_name: 'Cafe',
    });
    expect(mapPinRowFromOptimisticRec(rec({ id: 'r1' }))).toBeNull();
  });
});
