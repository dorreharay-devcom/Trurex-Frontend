import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { useMyRexes } from '~/features/profile/hooks/data/useMyRexes';
import { respondToRexRequest } from '~/features/rex-requests/api/rexRequestsApi';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';

type Params = {
  open: boolean;
  requestId: string;
  onClose: () => void;
  excludeRexIds?: ReadonlySet<string>;
};

export function useMyRexPicker({ open, requestId, onClose, excludeRexIds }: Params) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const rexes = useMyRexes(user?.id);
  const availableRexes = useMemo(
    () =>
      excludeRexIds?.size ? rexes.data.filter((rec) => !excludeRexIds.has(rec.id)) : rexes.data,
    [rexes.data, excludeRexIds],
  );
  const list = useMemo(() => ({ ...rexes, data: availableRexes }), [rexes, availableRexes]);
  const [selectedRexId, setSelectedRexId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedRexId(null);
  }, [open]);

  const toggle = useCallback((rexId: string) => {
    setSelectedRexId((prev) => (prev === rexId ? null : rexId));
  }, []);

  const submit = useCallback(async () => {
    if (!selectedRexId) {
      onClose();
      return;
    }
    if (!assertOnlineForMutation('Tagging a Rex')) return;
    setSubmitting(true);
    try {
      await respondToRexRequest(requestId, selectedRexId);
      void queryClient.invalidateQueries({
        queryKey: REX_REQUEST_QUERY_KEYS.responses(requestId),
      });
      toastSuccess('Rex tagged', 'Your response was added.');
      onClose();
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError("Couldn't tag Rex", unknownErrorMessage(e, 'Try again.'));
    } finally {
      setSubmitting(false);
    }
  }, [selectedRexId, requestId, onClose, queryClient]);

  return { list, selectedRexId, toggle, submitting, submit };
}
