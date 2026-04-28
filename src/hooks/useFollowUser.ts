import { useMutation } from '@tanstack/react-query';
import { followUser, unfollowUser } from '~/api/usersApi';
import { toastError } from '~/utils/appToast';

export const useFollowUser = (targetUserId: string, onSuccess?: () => void) => {
  const follow = useMutation({
    mutationFn: () => followUser(targetUserId),
    onSuccess,
    onError: () => toastError('Failed to follow user'),
  });

  const unfollow = useMutation({
    mutationFn: () => unfollowUser(targetUserId),
    onSuccess,
    onError: () => toastError('Failed to unfollow user'),
  });

  return { follow, unfollow };
};
