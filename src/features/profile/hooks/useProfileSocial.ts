import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { followUser, unfollowUser } from '~/features/profile/api/followApi';
import { useBlockUser } from '~/features/profile/hooks/useBlockUser';
import { toastError } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';

type Params = {
  viewerId?: string;
  targetUserId: string;
  onRefresh: () => void | Promise<void>;
  onBlocked?: () => void;
};

export function useProfileSocial({ viewerId, targetUserId, onRefresh, onBlocked }: Params) {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  const follow = useMutation({
    mutationFn: () => followUser(targetUserId),
    onSuccess: onRefresh,
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Failed to follow user');
    },
  });

  const unfollow = useMutation({
    mutationFn: () => unfollowUser(targetUserId),
    onSuccess: onRefresh,
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Failed to unfollow user');
    },
  });

  const {
    isBlocked,
    block,
    unblock,
    isPending: blockPending,
  } = useBlockUser({
    viewerId,
    targetUserId,
    onBlocked: () => {
      setShowBlockConfirm(false);
      onBlocked?.();
    },
  });

  const onFollow = useCallback(() => {
    follow.mutate();
  }, [follow]);

  const onUnfollow = useCallback(() => {
    unfollow.mutate();
  }, [unfollow]);

  const onUnblock = useCallback(() => {
    unblock.mutate();
  }, [unblock]);

  const onConfirmBlock = useCallback(() => {
    block.mutate();
  }, [block]);

  const openBlockConfirm = useCallback(() => setShowBlockConfirm(true), []);

  const closeBlockConfirm = useCallback(() => {
    if (block.isPending) return;
    setShowBlockConfirm(false);
  }, [block.isPending]);

  return {
    onFollow,
    onUnfollow,
    onUnblock,
    onConfirmBlock,
    followLoading: follow.isPending || unfollow.isPending,
    isBlocked,
    blockPending,
    blockPendingConfirm: block.isPending,
    showBlockConfirm,
    openBlockConfirm,
    closeBlockConfirm,
  };
}
