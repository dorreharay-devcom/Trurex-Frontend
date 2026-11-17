import { describe, expect, it } from 'vitest';
import { placeIdRef, placeRefRpcParams, rexPlaceRef } from '~/features/business/lib/placeRef';

describe('place refs', () => {
  it('builds refs only from present ids', () => {
    expect(rexPlaceRef('rex-1')).toEqual({ kind: 'rex', id: 'rex-1' });
    expect(placeIdRef('place-1')).toEqual({ kind: 'place', id: 'place-1' });
    expect(rexPlaceRef('')).toBeNull();
    expect(placeIdRef(null)).toBeNull();
    expect(rexPlaceRef(undefined)).toBeNull();
  });

  it('sends the matching RPC parameter', () => {
    expect(placeRefRpcParams({ kind: 'rex', id: 'rex-1' })).toEqual({ p_rex_id: 'rex-1' });
    expect(placeRefRpcParams({ kind: 'place', id: 'place-1' })).toEqual({ p_place_id: 'place-1' });
  });
});
