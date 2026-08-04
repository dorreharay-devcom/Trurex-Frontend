import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addCircleMember, createCircle } from '~/features/circles/api/circlesApi';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { didAccountFrozenMutationToast, mutationErrorToast } from '~/shared/lib/errors/restriction';
import { toastError, toastSuccess } from '~/shared/lib/appToast';

type CircleFormInput = {
  name: string;
  description: string;
  color: string;
};

type Args = {
  memberId: string;
  onAssigned: () => void;
};

export function useAssignToCircle({ memberId, onAssigned }: Args) {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);

  const assignMutation = useMutation({
    mutationFn: ({ circleId }: { circleId: string }) => addCircleMember(circleId, memberId),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({
        queryKey: [CIRCLES_QUERY_KEYS.circleMembers, vars.circleId],
      });
      void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEYS.myCircles });
      toastSuccess('Added to circle');
      onAssigned();
    },
    onError: mutationErrorToast('Could not add to circle'),
  });

  const assign = (circleId: string) => assignMutation.mutate({ circleId });

  const createAndAssign = async (input: CircleFormInput): Promise<boolean> => {
    const name = input.name.trim();
    if (!name) return false;
    setCreating(true);
    try {
      const created = await createCircle({
        input_name: name,
        input_description: input.description.trim() || null,
        input_icon_url: null,
        input_color: input.color,
      });
      void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEYS.myCircles });
      await assignMutation.mutateAsync({ circleId: created.id });
      return true;
    } catch (e) {
      if (!didAccountFrozenMutationToast(e)) {
        toastError('Could not create circle', unknownErrorMessage(e, 'Unknown error'));
      }
      return false;
    } finally {
      setCreating(false);
    }
  };

  const pendingCircleId = assignMutation.isPending ? assignMutation.variables?.circleId : undefined;

  return {
    assign,
    createAndAssign,
    pendingCircleId,
    inFlight: assignMutation.isPending || creating,
  };
}
