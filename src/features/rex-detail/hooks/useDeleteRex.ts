import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRex } from '~/features/rex-detail/api/rexDetailApi';
import { deleteRexToastMessage } from '~/features/rex-detail/lib/rexDetailToRecommendation';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { invalidateActiveRexSurfaces } from '~/shared/lib/query/invalidateActiveRexSurfaces';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

type UseDeleteRexArgs = {
  recommendationId: string | undefined;
  visible: boolean;
  onDeleted: () => void;
};

export function useDeleteRex({ recommendationId, visible, onDeleted }: UseDeleteRexArgs) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!visible) setConfirmOpen(false);
  }, [visible]);

  const mutationFn = withOnlineMutation('Deleting', deleteRex);
  const mutation = useMutation({
    mutationFn,
    onSuccess: (_data, rexId) => {
      setConfirmOpen(false);
      toastSuccess('Deleted', 'Your recommendation was removed.');
      void queryClient.removeQueries({ queryKey: ['rexDetail', rexId] });
      invalidateActiveRexSurfaces(queryClient);
      onDeleted();
    },
    onError: (err: unknown) => {
      if (didAccountFrozenMutationToast(err)) return;
      toastError('Could not delete', deleteRexToastMessage(err));
    },
  });

  const openConfirm = useCallback(() => setConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);
  const confirmDelete = useCallback(() => {
    if (!recommendationId) return;
    mutation.mutate(recommendationId);
  }, [recommendationId, mutation]);

  return { confirmOpen, openConfirm, closeConfirm, confirmDelete, pending: mutation.isPending };
}

export type DeleteRexState = ReturnType<typeof useDeleteRex>;
