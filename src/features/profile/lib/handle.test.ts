import { describe, expect, it } from 'vitest';
import {
  formatProfileHandle,
  normalizeHandleForSave,
  normalizeHandleInput,
  parseProfileRouteSlug,
} from '~/features/profile/lib/handle';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('profile handle', () => {
  it('normalizes input and save shape', () => {
    expect(normalizeHandleInput('@@Alex ')).toBe('Alex');
    expect(normalizeHandleForSave('')).toBeNull();
    expect(normalizeHandleForSave('@Alex Smith')).toBe('alexsmith');
  });

  it('formats display handle and route slugs', () => {
    expect(formatProfileHandle(null)).toBeNull();
    expect(formatProfileHandle('alex')).toBe('@alex');
    expect(formatProfileHandle('@alex')).toBe('@alex');
    expect(parseProfileRouteSlug(undefined)).toEqual({});
    expect(parseProfileRouteSlug(UUID)).toEqual({ userId: UUID });
    expect(parseProfileRouteSlug('@Cool')).toEqual({ handle: 'Cool' });
  });
});
