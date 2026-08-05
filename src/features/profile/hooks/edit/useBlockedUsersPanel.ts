import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { unblockUser as unblockUserRequest } from '~/features/profile/api/blockUserApi';
import { blockedUsersQueryKey, useBlockedUsers } from '~/features/profile/hooks/useBlockUser';
import type { BlockedUserRow } from '~/features/profile/types/blockedUser';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { toastError, toastSuccess } from '~/shared/lib/appToast';

export function useBlockedUsersPanel() {
  const { user } = useAuth();
  const viewerId = user?.id;
  const queryClient = useQueryClient();
  const list = useBlockedUsers(viewerId);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const unblockFn = withOnlineMutation('Unblocking', unblockUserRequest);
  const unblock = useMutation({
    mutationFn: unblockFn,
    onMutate: (targetUserId) => {
      setPendingUserId(targetUserId);
    },
    onSuccess: (_data, targetUserId) => {
      if (viewerId) {
        queryClient.setQueryData<BlockedUserRow[]>(blockedUsersQueryKey(viewerId), (prev) =>
          (prev ?? []).filter((row) => row.user_id !== targetUserId),
        );
        void queryClient.invalidateQueries({ queryKey: blockedUsersQueryKey(viewerId) });
      }
      void queryClient.invalidateQueries({
        queryKey: REX_QUERY_KEYS.discoverFeed,
        refetchType: 'active',
      });
      toastSuccess('User unblocked');
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError(unknownErrorMessage(e, 'Failed to unblock user'));
    },
    onSettled: () => {
      setPendingUserId(null);
    },
  });

  const unblockUser = useCallback(
    (targetUserId: string) => {
      unblock.mutate(targetUserId);
    },
    [unblock],
  );

  return {
    rows: list.data ?? [],
    isLoading: list.isLoading,
    isError: list.isError,
    isFetching: list.isFetching,
    refetch: list.refetch,
    pendingUserId,
    anyUnblockPending: unblock.isPending,
    unblockUser,
  };
}
