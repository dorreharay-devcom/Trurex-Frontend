import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CollectionsApi } from '~/features/collections/api/collectionsApi';
import { SAVED_REX_DEPENDENT_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import { useAuth } from '~/features/auth/providers';
import type { RecSummary } from '~/features/collections/types/recSummary';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';

type Params = {
  open: boolean;
  rec: RecSummary | null;
  onSaved?: () => void;
  onRemove?: () => void;
  onUnsaved?: () => void;
  onUnsaveFailed?: () => void;
  onSaveRexFailed?: () => void;
};

export function useSavedRexActions({
  open,
  rec,
  onSaved,
  onRemove,
  onUnsaved,
  onUnsaveFailed,
  onSaveRexFailed,
}: Params) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRexSaved, setIsRexSaved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [savingUncollected, setSavingUncollected] = useState(false);

  useEffect(() => {
    if (!open || !rec) return;
    setIsRexSaved(Boolean(rec.isSaved));
    setRemoving(false);
    setSavingUncollected(false);
  }, [open, rec]);

  const invalidateSavedQueries = useCallback(() => {
    for (const queryKey of SAVED_REX_DEPENDENT_QUERY_KEYS) {
      queryClient.invalidateQueries({ queryKey: [...queryKey] });
    }
  }, [queryClient]);

  const ensureRexSaved = useCallback(async () => {
    if (isRexSaved || !user || !rec) return;
    await CollectionsApi.saveRex(user.id, rec.id);
    setIsRexSaved(true);
    onSaved?.();
    invalidateSavedQueries();
  }, [isRexSaved, user, rec, onSaved, invalidateSavedQueries]);

  const saveToUncollected = useCallback(async () => {
    if (!user || !rec || isRexSaved || savingUncollected) return;
    setSavingUncollected(true);
    try {
      await ensureRexSaved();
      toastSuccess('Saved to uncollected');
    } catch (e: unknown) {
      if (didAccountFrozenMutationToast(e)) return;
      onSaveRexFailed?.();
      toastError('Failed to save', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setSavingUncollected(false);
    }
  }, [user, rec, isRexSaved, savingUncollected, ensureRexSaved, onSaveRexFailed]);

  const removeFromUncollected = useCallback(async () => {
    if (!user || !rec || removing) return;
    setRemoving(true);
    onUnsaved?.();
    setIsRexSaved(false);
    try {
      await CollectionsApi.unsaveRex(user.id, rec.id);
      invalidateSavedQueries();
      onRemove?.();
      toastSuccess('Removed from saved');
    } catch (e: unknown) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not remove', unknownErrorMessage(e, 'Try again.'));
      setIsRexSaved(true);
      onUnsaveFailed?.();
    } finally {
      setRemoving(false);
    }
  }, [user, rec, removing, onUnsaved, invalidateSavedQueries, onRemove, onUnsaveFailed]);

  return {
    isRexSaved,
    removing,
    savingUncollected,
    ensureRexSaved,
    saveToUncollected,
    removeFromUncollected,
  };
}

export type SavedRexActionsState = ReturnType<typeof useSavedRexActions>;
