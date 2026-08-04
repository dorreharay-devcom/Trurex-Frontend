import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRex } from '~/features/rex-detail/api/rexDetailApi';
import { deleteRexToastMessage } from '~/features/rex-detail/lib/rexDetailToRecommendation';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

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

  const mutation = useMutation({
    mutationFn: deleteRex,
    onSuccess: (_data, rexId) => {
      setConfirmOpen(false);
      toastSuccess('Deleted', 'Your recommendation was removed.');
      void queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.discoverFeed });
      void queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.searchRexes });
      void queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.myRexes });
      void queryClient.removeQueries({ queryKey: ['rexDetail', rexId] });
      void queryClient.invalidateQueries({ queryKey: ['collection-detail'] });
      void queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      void queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.mapRexesInBounds });
      void queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.mapRexPins });
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
