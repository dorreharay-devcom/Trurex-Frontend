import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blockUser, fetchBlockedUsers, unblockUser } from '~/features/profile/api/blockUserApi';
import type { BlockedUserRow } from '~/features/profile/types/blockedUser';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { isPlainObject, unknownErrorMessage } from '~/shared/lib/data/guards';
import { invalidateActiveRexSurfaces } from '~/shared/lib/query/invalidateActiveRexSurfaces';
import { isOfflineMutationBlocked, withOnlineMutation } from '~/shared/lib/network/assertOnline';

export const blockedUsersQueryKey = (viewerId: string) => ['blocked-users', viewerId] as const;

function blockErrorMessage(error: unknown): string {
  if (isPlainObject(error)) {
    const code = typeof error.code === 'string' ? error.code : undefined;
    if (code === '22023') return 'You cannot block yourself';
    if (code === 'P0002') return 'User not found';
    if (code === '42501') return 'Sign in to block users';
  }
  return unknownErrorMessage(error, 'Something went wrong');
}

export function useBlockedUsers(viewerId: string | undefined) {
  return useQuery({
    queryKey: viewerId ? blockedUsersQueryKey(viewerId) : ['blocked-users', 'guest'],
    queryFn: fetchBlockedUsers,
    enabled: Boolean(viewerId),
    staleTime: 60_000,
  });
}

export function useBlockUser(params: {
  viewerId: string | undefined;
  targetUserId: string;
  onBlocked?: () => void;
}) {
  const { viewerId, targetUserId, onBlocked } = params;
  const queryClient = useQueryClient();
  const blockedQuery = useBlockedUsers(viewerId);

  const isBlocked = useMemo(() => {
    if (!targetUserId || !viewerId || viewerId === targetUserId) return false;
    return (blockedQuery.data ?? []).some((row) => row.user_id === targetUserId);
  }, [blockedQuery.data, targetUserId, viewerId]);

  const invalidateAfterChange = useCallback(() => {
    if (viewerId) {
      void queryClient.invalidateQueries({ queryKey: blockedUsersQueryKey(viewerId) });
    }
    invalidateActiveRexSurfaces(queryClient, { includeCollections: false });
    void queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'active' });
  }, [queryClient, viewerId]);

  const blockFn = withOnlineMutation('Blocking', (_: void) => blockUser(targetUserId));
  const unblockFn = withOnlineMutation('Unblocking', (_: void) => unblockUser(targetUserId));

  const block = useMutation({
    mutationFn: blockFn,
    onSuccess: () => {
      if (viewerId) {
        queryClient.setQueryData<BlockedUserRow[]>(blockedUsersQueryKey(viewerId), (prev) => {
          const list = prev ?? [];
          if (list.some((row) => row.user_id === targetUserId)) return list;
          return [
            {
              user_id: targetUserId,
              display_name: 'Member',
              handle: null,
              avatar_url: null,
              blocked_at: new Date().toISOString(),
            },
            ...list,
          ];
        });
      }
      invalidateAfterChange();
      toastSuccess('User blocked', 'Their content is hidden from your feed.');
      onBlocked?.();
    },
    onError: (e: unknown) => {
      if (isOfflineMutationBlocked(e)) return;
      if (didAccountFrozenMutationToast(e)) return;
      toastError(blockErrorMessage(e));
    },
  });

  const unblock = useMutation({
    mutationFn: unblockFn,
    onSuccess: () => {
      if (viewerId) {
        queryClient.setQueryData<BlockedUserRow[]>(blockedUsersQueryKey(viewerId), (prev) =>
          (prev ?? []).filter((row) => row.user_id !== targetUserId),
        );
      }
      invalidateAfterChange();
      toastSuccess('User unblocked');
    },
    onError: (e: unknown) => {
      if (isOfflineMutationBlocked(e)) return;
      if (didAccountFrozenMutationToast(e)) return;
      toastError(blockErrorMessage(e));
    },
  });

  return {
    isBlocked,
    hydrated: blockedQuery.isFetched || !viewerId,
    block,
    unblock,
    isPending: block.isPending || unblock.isPending,
  };
}
