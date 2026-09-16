import { describe, expect, it } from 'vitest';
import { isOnlineState } from '~/shared/lib/query/isOnlineState';

describe('isOnlineState', () => {
  it('is online when connected', () => {
    expect(isOnlineState({ isConnected: true })).toBe(true);
  });

  it('is offline only when definitely disconnected', () => {
    expect(isOnlineState({ isConnected: false })).toBe(false);
  });

  it('assumes online while connectivity is still unknown', () => {
    expect(isOnlineState({ isConnected: null })).toBe(true);
  });
});
