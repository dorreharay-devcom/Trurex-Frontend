import { useMutation, useQueryClient } from '@tanstack/react-query';
import { untagRexFromRequest } from '~/features/rex-requests/api/rexRequestsApi';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

export function useUntagRexFromRequest(requestId: string) {
  const queryClient = useQueryClient();

  const mutationFn = withOnlineMutation('Untagging', (rexId: string) =>
    untagRexFromRequest(requestId, rexId),
  );
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      toastSuccess('Rex untagged');
      void queryClient.invalidateQueries({ queryKey: REX_REQUEST_QUERY_KEYS.responses(requestId) });
    },
    onError: (err: unknown) => {
      if (didAccountFrozenMutationToast(err)) return;
      toastError('Could not untag Rex', unknownErrorMessage(err, 'Try again.'));
    },
  });

  return {
    untag: (rexId: string) => mutation.mutate(rexId),
    isPending: (rexId: string) => mutation.isPending && mutation.variables === rexId,
  };
}
