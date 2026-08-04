import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteCircle } from '~/features/circles/api/circlesApi';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';
import type { CircleApiRow } from '~/features/circles/types/circle';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';

export type DeleteCircleState = ReturnType<typeof useDeleteCircle>;

export function useDeleteCircle(circle: CircleApiRow | undefined, onDeleted: () => void) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!circle) throw new Error('No circle');
      return deleteCircle(circle.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEYS.myCircles });
      setConfirmOpen(false);
      onDeleted();
      toastSuccess('Circle deleted');
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      setConfirmOpen(false);
      toastError('Could not delete circle', unknownErrorMessage(e, 'Try again.'));
    },
  });

  const dismiss = () => {
    if (!deleteMutation.isPending) setConfirmOpen(false);
  };

  return {
    confirmOpen,
    request: () => setConfirmOpen(true),
    dismiss,
    commit: () => deleteMutation.mutate(),
    pending: deleteMutation.isPending,
  };
}
