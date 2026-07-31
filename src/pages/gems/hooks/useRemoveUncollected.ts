import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CollectionsApi } from '~/features/collections/api/collectionsApi';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';
import { useAuth } from '~/features/auth/providers';
import type { Recommendation } from '~/shared/types/recommendation';
import { toastError } from '~/utils/appToast';
import { unknownErrorMessage } from '~/utils';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';

export function useRemoveUncollected() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<Recommendation | null>(null);
  const [pending, setPending] = useState(false);

  const confirm = useCallback(async () => {
    if (!user || !target) return;
    setPending(true);
    try {
      await CollectionsApi.unsaveRex(user.id, target.id);
      queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.mySavedRexes });
      queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.discoverFeed });
      setTarget(null);
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not remove', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setPending(false);
    }
  }, [user, target, queryClient]);

  const cancel = useCallback(() => {
    if (pending) return;
    setTarget(null);
  }, [pending]);

  return { target, setTarget, pending, confirm, cancel };
}

export type RemoveUncollectedState = ReturnType<typeof useRemoveUncollected>;
