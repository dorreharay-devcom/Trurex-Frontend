import type { QueryClient } from '@tanstack/react-query';
import { NOTIFICATION_TYPE } from '~/shared/config/notificationTypes';
import { invalidateBusinessAccount } from '~/shared/lib/query/invalidateBusinessAccount';

export function isBusinessAccountNotification(type: unknown): boolean {
  return type === NOTIFICATION_TYPE.business_claim_approved;
}

export function refreshQueriesForNotification(queryClient: QueryClient, type: unknown): void {
  if (isBusinessAccountNotification(type)) invalidateBusinessAccount(queryClient);
}
