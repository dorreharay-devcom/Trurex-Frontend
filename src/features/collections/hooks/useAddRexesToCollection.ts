import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAddRexToCollection } from '~/features/collections/hooks/data/useCollectionRexMutations';
import { useSavedRexes } from '~/features/collections/hooks/data/useSavedRexes';
import { useSelectionSet } from '~/features/collections/hooks/common/useSelectionSet';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import { rexCountLabel } from '~/features/collections/lib/labels';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';

const TOAST_AFTER_SHEET_CLOSE_DELAY_MS = 400;

type Params = {
  open: boolean;
  collectionId: string | null;
  onClose: () => void;
};

export function useAddRexesToCollection({ open, collectionId, onClose }: Params) {
  const queryClient = useQueryClient();
  const list = useSavedRexes({ uncollected: true });
  const { mutateAsync: addRex } = useAddRexToCollection();
  const selection = useSelectionSet();
  const [saving, setSaving] = useState(false);

  const { reset } = selection;
  const { refetch } = list;
  useEffect(() => {
    if (!open) return;
    reset();
    void refetch();
  }, [open, reset, refetch]);

  const showToastAfterClose = useCallback(
    (show: () => void) => {
      onClose();
      setTimeout(show, TOAST_AFTER_SHEET_CLOSE_DELAY_MS);
    },
    [onClose],
  );

  const submit = useCallback(async () => {
    const { selected } = selection;
    if (!collectionId || selected.size === 0) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      await Promise.all(
        [...selected].map((rexId) => addRex({ collection_id: collectionId, rex_id: rexId })),
      );
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.collectionDetail] });
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.mySavedRexes] });
      setSaving(false);
      const count = selected.size;
      showToastAfterClose(() => toastSuccess(`Added ${rexCountLabel(count)}`));
    } catch (e: unknown) {
      setSaving(false);
      if (didAccountFrozenMutationToast(e)) {
        showToastAfterClose(() => toastError(unknownErrorMessage(e, 'Account is frozen')));
        return;
      }
      showToastAfterClose(() =>
        toastError('Failed to add rexes', unknownErrorMessage(e, 'Try again.')),
      );
    }
  }, [selection, collectionId, onClose, addRex, queryClient, showToastAfterClose]);

  return { list, selection, saving, submit };
}
