import { describe, expect, it } from 'vitest';
import {
  firstRouteParam,
  parseOptionalRouteId,
  searchParam,
} from '~/shared/lib/navigation/routeIds';
import {
  isHttpUrl,
  isStrictUuid,
  nextPageOffset,
  normalizeWebsiteUrl,
  unknownErrorMessage,
} from '~/shared/lib/data/guards';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('routeIds', () => {
  it('parses valid uuid ids only', () => {
    expect(parseOptionalRouteId(UUID)).toBe(UUID);
    expect(parseOptionalRouteId(` ${UUID} `)).toBe(UUID);
    expect(parseOptionalRouteId([UUID, 'x'])).toBe(UUID);
    expect(parseOptionalRouteId('nope')).toBeNull();
    expect(parseOptionalRouteId(undefined)).toBeNull();
  });

  it('reads first non-empty route param', () => {
    expect(firstRouteParam([' a ', 'b'])).toBe('a');
    expect(firstRouteParam('  ')).toBeUndefined();
    expect(firstRouteParam(undefined)).toBeUndefined();
  });

  it('omits empty search params from setParams', () => {
    expect(searchParam(null)).toBeUndefined();
    expect(searchParam('')).toBeUndefined();
    expect(searchParam('followers')).toBe('followers');
  });
});

describe('guards helpers', () => {
  it('validates strict uuid', () => {
    expect(isStrictUuid(UUID)).toBe(true);
    expect(isStrictUuid('not-uuid')).toBe(false);
  });

  it('computes next page offset only when page is full', () => {
    expect(nextPageOffset([1, 2], [[1, 2]], 2)).toBe(2);
    expect(nextPageOffset([1], [[1]], 2)).toBeUndefined();
  });

  it('normalizes website urls', () => {
    expect(normalizeWebsiteUrl('')).toBeNull();
    expect(normalizeWebsiteUrl('example.com')).toBe('https://example.com');
    expect(normalizeWebsiteUrl('https://example.com')).toBe('https://example.com');
    expect(isHttpUrl('https://x.com')).toBe(true);
    expect(isHttpUrl('ftp://x.com')).toBe(false);
  });

  it('extracts unknown error messages', () => {
    expect(unknownErrorMessage(new Error('boom'), 'fallback')).toBe('boom');
    expect(unknownErrorMessage({ message: 'rpc' }, 'fallback')).toBe('rpc');
    expect(unknownErrorMessage(null, 'fallback')).toBe('fallback');
  });
});
