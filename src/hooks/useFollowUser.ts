import { useMutation } from '@tanstack/react-query';
import { followUser, unfollowUser } from '~/shared/api/usersApi';
import { toastError } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';

export const useFollowUser = (targetUserId: string, onSuccess?: () => void) => {
  const follow = useMutation({
    mutationFn: () => followUser(targetUserId),
    onSuccess,
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Failed to follow user');
    },
  });

  const unfollow = useMutation({
    mutationFn: () => unfollowUser(targetUserId),
    onSuccess,
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Failed to unfollow user');
    },
  });

  return { follow, unfollow };
};
