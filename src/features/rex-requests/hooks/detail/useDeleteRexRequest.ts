import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRexRequest } from '~/features/rex-requests/api/rexRequestsApi';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

type Args = {
  requestId: string | undefined;
  visible: boolean;
  onDeleted: () => void;
};

export function useDeleteRexRequest({ requestId, visible, onDeleted }: Args) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!visible) setConfirmOpen(false);
  }, [visible]);

  const mutationFn = withOnlineMutation('Deleting', deleteRexRequest);
  const mutation = useMutation({
    mutationFn,
    onSuccess: (_data, id) => {
      setConfirmOpen(false);
      toastSuccess('Deleted', 'Your Rex Request was removed.');
      void queryClient.removeQueries({ queryKey: REX_REQUEST_QUERY_KEYS.detail(id) });
      void queryClient.invalidateQueries({ queryKey: REX_REQUEST_QUERY_KEYS.feed });
      onDeleted();
    },
    onError: (err: unknown) => {
      if (didAccountFrozenMutationToast(err)) return;
      toastError('Could not delete', unknownErrorMessage(err, 'Try again.'));
    },
  });

  const openConfirm = useCallback(() => setConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);
  const confirmDelete = useCallback(() => {
    if (!requestId) return;
    mutation.mutate(requestId);
  }, [requestId, mutation]);

  return { confirmOpen, openConfirm, closeConfirm, confirmDelete, pending: mutation.isPending };
}

export type DeleteRexRequestState = ReturnType<typeof useDeleteRexRequest>;
