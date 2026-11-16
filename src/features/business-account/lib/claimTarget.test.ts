import { describe, expect, it } from 'vitest';
import {
  claimSubjectTitle,
  resolveClaimTarget,
  toPlaceClaimTarget,
  toSubmitClaimParams,
} from '~/features/business-account/lib/claimTarget';

const rexSubject = { kind: 'rex', rexId: 'rex-1', title: ' Acme Rex ' } as const;

describe('toPlaceClaimTarget', () => {
  it('trims values and drops blanks', () => {
    expect(toPlaceClaimTarget(' place-1 ', ' Acme ')).toEqual({
      placeId: 'place-1',
      placeName: 'Acme',
    });
    expect(toPlaceClaimTarget(null, 'Acme')).toEqual({ placeId: null, placeName: 'Acme' });
    expect(toPlaceClaimTarget('  ', undefined)).toBeNull();
  });
});

describe('resolveClaimTarget', () => {
  it('returns nothing without a subject', () => {
    expect(resolveClaimTarget(null, undefined)).toBeNull();
  });

  it('passes place subjects through', () => {
    const target = { placeId: 'place-1', placeName: 'Acme' };
    expect(resolveClaimTarget({ kind: 'place', target }, undefined)).toBe(target);
  });

  it('waits for the place summary of a picked rex', () => {
    expect(resolveClaimTarget(rexSubject, undefined)).toBeNull();
  });

  it('uses the place summary and falls back to the rex title', () => {
    expect(resolveClaimTarget(rexSubject, { place_id: 'place-1', place_name: 'Acme' })).toEqual({
      placeId: 'place-1',
      placeName: 'Acme',
    });
    expect(resolveClaimTarget(rexSubject, { place_id: null, place_name: '  ' })).toEqual({
      placeId: null,
      placeName: 'Acme Rex',
    });
    expect(resolveClaimTarget(rexSubject, null)).toEqual({ placeId: null, placeName: 'Acme Rex' });
  });
});

describe('claimSubjectTitle', () => {
  it('reads the title from either subject kind', () => {
    expect(claimSubjectTitle(null)).toBeNull();
    expect(claimSubjectTitle(rexSubject)).toBe('Acme Rex');
    expect(
      claimSubjectTitle({ kind: 'place', target: { placeId: 'place-1', placeName: 'Acme' } }),
    ).toBe('Acme');
  });
});

describe('toSubmitClaimParams', () => {
  it('sends only the values that are present', () => {
    expect(toSubmitClaimParams({ placeId: 'place-1', placeName: 'Acme' })).toEqual({
      p_place_id: 'place-1',
      p_place_name: 'Acme',
    });
    expect(toSubmitClaimParams({ placeId: null, placeName: 'Acme' })).toEqual({
      p_place_name: 'Acme',
    });
    expect(toSubmitClaimParams({ placeId: 'place-1', placeName: null })).toEqual({
      p_place_id: 'place-1',
    });
  });
});
