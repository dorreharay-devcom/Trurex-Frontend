import { describe, expect, it } from 'vitest';
import { isSameAuthSession } from '~/shared/lib/errors/authSession';
import type { Session, User } from '@supabase/supabase-js';

function session(partial: {
  access_token: string;
  refresh_token?: string;
  userId: string;
  expires_at?: number;
}): Session {
  return {
    access_token: partial.access_token,
    refresh_token: partial.refresh_token ?? 'r',
    expires_at: partial.expires_at ?? 1,
    expires_in: 3600,
    token_type: 'bearer',
    user: { id: partial.userId } as User,
  };
}

describe('isSameAuthSession', () => {
  it('treats identical token/user/expiry as same', () => {
    const a = session({ access_token: 'a', userId: 'u1', expires_at: 10 });
    const b = session({ access_token: 'a', userId: 'u1', expires_at: 10 });
    expect(isSameAuthSession(a, b)).toBe(true);
  });

  it('detects token refresh as different', () => {
    const a = session({ access_token: 'a', userId: 'u1' });
    const b = session({ access_token: 'b', userId: 'u1' });
    expect(isSameAuthSession(a, b)).toBe(false);
  });

  it('handles nulls', () => {
    expect(isSameAuthSession(null, null)).toBe(true);
    expect(isSameAuthSession(session({ access_token: 'a', userId: 'u' }), null)).toBe(false);
  });
});
