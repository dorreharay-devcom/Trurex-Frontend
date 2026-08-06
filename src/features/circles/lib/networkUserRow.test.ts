import { describe, expect, it } from 'vitest';
import {
  normalizeNetworkUserRow,
  parseNetworkUserRows,
} from '~/features/circles/lib/networkUserRow';
import { RELATIONSHIP_STATUS } from '~/shared/config/relationshipStatus';

describe('networkUserRow', () => {
  it('normalizes single row with optional counts', () => {
    const row = normalizeNetworkUserRow({
      user_id: 'u1',
      display_name: null,
      handle: '@a',
      avatar_url: null,
      trust_score: 3,
      relationship_status: RELATIONSHIP_STATUS.following,
      followed_at: '2020',
      bio: 'hi',
      followers_count: 2,
      following_count: 4,
      rexes_created_count: 1,
    });
    expect(row).toMatchObject({
      user_id: 'u1',
      display_name: 'Member',
      handle: '@a',
      trust_score: 3,
      relationship_status: RELATIONSHIP_STATUS.following,
      followers_count: 2,
      following_count: 4,
      rexes_created_count: 1,
    });
  });

  it('parses payload arrays and drops empty ids', () => {
    expect(parseNetworkUserRows([{ user_id: 'u1' }, { user_id: '' }])).toHaveLength(1);
    expect(parseNetworkUserRows({ user_id: 'solo' })).toHaveLength(1);
  });
});
