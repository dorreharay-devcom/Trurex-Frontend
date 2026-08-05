import { describe, expect, it } from 'vitest';
import { canEditOrDeleteUserCircle, getCircleUiPolicy } from '~/features/circles/lib/circlePolicy';
import type { CircleApiRow } from '~/features/circles/types/circle';

const base = (partial: Partial<CircleApiRow>): CircleApiRow => ({
  id: 'c1',
  owner_id: 'u1',
  name: 'Circle',
  description: null,
  icon_url: null,
  system_kind: null,
  is_active: true,
  created_at: '2020-01-01',
  updated_at: '2020-01-01',
  ...partial,
});

describe('circlePolicy', () => {
  it('allows edit only for own user-created circles', () => {
    expect(canEditOrDeleteUserCircle(base({}), 'u1')).toBe(true);
    expect(canEditOrDeleteUserCircle(base({}), 'u2')).toBe(false);
    expect(canEditOrDeleteUserCircle(base({ system_kind: 'trusted' }), 'u1')).toBe(false);
    expect(canEditOrDeleteUserCircle(base({}), undefined)).toBe(false);
  });

  it('returns ui policy by system kind + aliases', () => {
    expect(getCircleUiPolicy(base({})).showConnectionsAddPanel).toBe(true);
    expect(getCircleUiPolicy(base({ system_kind: 'inner_circle' })).showConnectionsAddPanel).toBe(
      true,
    );
    expect(getCircleUiPolicy(base({ system_kind: 'trusted' })).allowOwnerRemoveMemberRpc).toBe(
      false,
    );
    expect(
      getCircleUiPolicy(base({ system_kind: 'close_friends' })).allowOwnerRemoveMemberRpc,
    ).toBe(false);
    expect(getCircleUiPolicy(base({ system_kind: 'unknown_kind' })).showConnectionsAddPanel).toBe(
      false,
    );
  });
});
