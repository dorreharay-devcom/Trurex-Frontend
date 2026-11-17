import { describe, expect, it, vi } from 'vitest';
import type { QueryClient } from '@tanstack/react-query';
import { BUSINESS_ACCOUNT_REFRESH_KEYS } from '~/shared/config/queryKeys';
import {
  isBusinessAccountNotification,
  refreshQueriesForNotification,
} from '~/shared/lib/notification/refresh';

function fakeQueryClient() {
  const invalidateQueries = vi.fn(async () => undefined);
  return { client: { invalidateQueries } as unknown as QueryClient, invalidateQueries };
}

describe('isBusinessAccountNotification', () => {
  it('matches only the business claim approval', () => {
    expect(isBusinessAccountNotification('business_claim_approved')).toBe(true);
    expect(isBusinessAccountNotification('comment')).toBe(false);
    expect(isBusinessAccountNotification(undefined)).toBe(false);
  });
});

describe('refreshQueriesForNotification', () => {
  it('refreshes business account queries after a claim approval', () => {
    const { client, invalidateQueries } = fakeQueryClient();
    refreshQueriesForNotification(client, 'business_claim_approved');
    expect(invalidateQueries.mock.calls).toEqual(
      BUSINESS_ACCOUNT_REFRESH_KEYS.map((queryKey) => [{ queryKey }]),
    );
  });

  it('leaves queries alone for other notifications', () => {
    const { client, invalidateQueries } = fakeQueryClient();
    refreshQueriesForNotification(client, 'thank');
    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
