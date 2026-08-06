import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addCircleMember, removeCircleMember } from '~/features/circles/api/circlesApi';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';
import { mutationErrorToast } from '~/shared/lib/errors/restriction';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { toastSuccess } from '~/shared/lib/appToast';

export function useCircleMembership(circleId: string) {
  const queryClient = useQueryClient();
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const invalidateMemberships = () => {
    void queryClient.invalidateQueries({ queryKey: [CIRCLES_QUERY_KEYS.circleMembers, circleId] });
    void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEYS.myCircles });
  };

  const addFn = withOnlineMutation('Adding to circles', async (userId: string) => {
    setAddingMemberId(userId);
    await addCircleMember(circleId, userId);
  });
  const removeFn = withOnlineMutation('Updating circles', async (userId: string) => {
    setRemovingMemberId(userId);
    await removeCircleMember(circleId, userId);
  });

  const addMutation = useMutation({
    mutationFn: addFn,
    onSuccess: () => {
      invalidateMemberships();
      toastSuccess('Added to circle');
    },
    onError: mutationErrorToast('Could not add to circle'),
    onSettled: () => setAddingMemberId(null),
  });

  const removeMutation = useMutation({
    mutationFn: removeFn,
    onSuccess: () => {
      invalidateMemberships();
      toastSuccess('Removed from circle');
    },
    onError: mutationErrorToast('Could not remove from circle'),
    onSettled: () => setRemovingMemberId(null),
  });

  return {
    addMember: (userId: string) => addMutation.mutate(userId),
    removeMember: (userId: string) => removeMutation.mutate(userId),
    addingMemberId,
    removingMemberId,
  };
}
