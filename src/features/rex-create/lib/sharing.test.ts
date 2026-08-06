import { describe, expect, it } from 'vitest';
import {
  canPostCreateRexShare,
  hasNonPublicMockCircleSelection,
  keepKnownCircleIds,
  PUBLIC_CIRCLE_KEY,
  resolveCreateRexCircleIds,
  resolveCreateRexVisibility,
  REX_VISIBILITY,
} from '~/features/rex-create/lib/sharing';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('create sharing', () => {
  it('resolves visibility', () => {
    expect(resolveCreateRexVisibility(new Set(), true)).toBe(REX_VISIBILITY.private);
    expect(resolveCreateRexVisibility(new Set([PUBLIC_CIRCLE_KEY]), false)).toBe(
      REX_VISIBILITY.public,
    );
    expect(resolveCreateRexVisibility(new Set(['pub']), false, 'pub')).toBe(REX_VISIBILITY.public);
    expect(resolveCreateRexVisibility(new Set([UUID]), false)).toBe(REX_VISIBILITY.circles);
  });

  it('filters circle uuids and known keys', () => {
    expect(resolveCreateRexCircleIds(new Set([PUBLIC_CIRCLE_KEY, UUID, 'mock']))).toEqual([UUID]);
    expect(resolveCreateRexCircleIds(new Set(['mock']))).toBeNull();
    expect(keepKnownCircleIds(new Set([PUBLIC_CIRCLE_KEY, UUID, 'gone']), new Set([UUID]))).toEqual(
      new Set([PUBLIC_CIRCLE_KEY, UUID]),
    );
  });

  it('gates can-post and mock circles', () => {
    expect(canPostCreateRexShare(true, new Set())).toBe(true);
    expect(canPostCreateRexShare(false, new Set([PUBLIC_CIRCLE_KEY]))).toBe(true);
    expect(canPostCreateRexShare(false, new Set([UUID]))).toBe(true);
    expect(canPostCreateRexShare(false, new Set(['mock']))).toBe(false);
    expect(hasNonPublicMockCircleSelection(new Set(['mock']))).toBe(true);
    expect(hasNonPublicMockCircleSelection(new Set([UUID]))).toBe(false);
  });
});
