import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRexRequest } from '~/features/rex-requests/api/rexRequestsApi';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

export function useResolveRexRequest(requestId: string) {
  const queryClient = useQueryClient();

  const mutationFn = withOnlineMutation('Resolving', resolveRexRequest);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      toastSuccess('Marked as resolved');
      void queryClient.invalidateQueries({ queryKey: REX_REQUEST_QUERY_KEYS.detail(requestId) });
      void queryClient.invalidateQueries({ queryKey: REX_REQUEST_QUERY_KEYS.feed });
    },
    onError: (err: unknown) => {
      if (didAccountFrozenMutationToast(err)) return;
      toastError('Could not resolve', unknownErrorMessage(err, 'Try again.'));
    },
  });

  return { resolve: () => mutation.mutate(requestId), pending: mutation.isPending };
}
