import { onlineManager } from '@tanstack/react-query';
import { toastError } from '~/shared/lib/appToast';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';
import { isPlainObject } from '~/shared/lib/data/guards';

export class OfflineMutationBlockedError extends Error {
  readonly offlineBlocked = true as const;

  constructor() {
    super('offline_blocked');
    this.name = 'OfflineMutationBlockedError';
  }
}

export function isOfflineMutationBlocked(error: unknown): boolean {
  if (error instanceof OfflineMutationBlockedError) return true;
  return isPlainObject(error) && error.offlineBlocked === true;
}

export function assertOnlineForMutation(actionLabel = 'This action'): boolean {
  if (onlineManager.isOnline()) return true;
  toastError('You are offline', `${actionLabel} needs a connection.`);
  track(AnalyticsEvent.OfflineBlockedMutation, { action: actionLabel });
  return false;
}

export function requireOnlineForMutation(actionLabel = 'This action'): void {
  if (assertOnlineForMutation(actionLabel)) return;
  throw new OfflineMutationBlockedError();
}

/**
 * Wraps an async write so offline toast + throw stay consistent.
 * Prefer this (or `requireOnlineForMutation` at the top of mutationFn) for every write path.
 * For React Query, extract to a const if inference mis-defaults to `void`:
 *   const mutationFn = withOnlineMutation('Label', apiFn)
 *   useMutation({ mutationFn, ... })
 */
export function withOnlineMutation<TVariables, TData>(
  actionLabel: string,
  fn: (variables: TVariables) => Promise<TData> | TData,
): (variables: TVariables) => Promise<TData> {
  return async (variables) => {
    requireOnlineForMutation(actionLabel);
    return await fn(variables);
  };
}
