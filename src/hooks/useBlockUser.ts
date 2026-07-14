import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  blockUser,
  fetchBlockedUsers,
  unblockUser,
} from '~/api/moderationApi';
import type { BlockedUserRow } from '~/types/moderation';
import { toastError, toastSuccess } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { isPlainObject } from '~/utils/guards';
import { unknownErrorMessage } from '~/utils';

export const blockedUsersQueryKey = (viewerId: string) =>
  ['blocked-users', viewerId] as const;

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
    void queryClient.invalidateQueries({ queryKey: ['discover-recommendations'] });
    void queryClient.invalidateQueries({ queryKey: ['mapRexesInBounds'] });
    void queryClient.invalidateQueries({ queryKey: ['mapRexPins'] });
    void queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }, [queryClient, viewerId]);

  const block = useMutation({
    mutationFn: () => blockUser(targetUserId),
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
      if (didAccountFrozenMutationToast(e)) return;
      toastError(blockErrorMessage(e));
    },
  });

  const unblock = useMutation({
    mutationFn: () => unblockUser(targetUserId),
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
