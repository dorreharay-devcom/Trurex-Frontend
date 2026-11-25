import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CollectionsApi } from '~/features/collections/api/collectionsApi';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import { modalConfig } from '~/shared/config/overlaySheet';
import type { RecSummary } from '~/features/collections/types/recSummary';
import { toastError, toastSuccessAfterDismiss } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { collectionMembershipDiff } from '~/features/collections/lib/mappers';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';

const TOAST_AFTER_SHEET_CLOSE_DELAY_MS = modalConfig.timing.sheetCloseMs + 180;

type Params = {
  rec: RecSummary | null;
  selected: Set<string>;
  original: Set<string>;
  ensureRexSaved: () => Promise<void>;
  setError: (error: string | null) => void;
  onClose: () => void;
  onCollectionCreated?: (collectionName: string) => void;
};

export function useAddToCollectionActions({
  rec,
  selected,
  original,
  ensureRexSaved,
  setError,
  onClose,
  onCollectionCreated,
}: Params) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const showErrorAfterClose = useCallback(
    (title: string, message?: string) => {
      onClose();
      setTimeout(() => {
        toastError(title, message);
      }, TOAST_AFTER_SHEET_CLOSE_DELAY_MS);
    },
    [onClose],
  );

  const invalidateCollectionQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections] });
    queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.collectionDetail] });
    queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.mySavedRexes] });
  }, [queryClient]);

  const applyChanges = useCallback(async () => {
    if (!rec) {
      onClose();
      return;
    }
    const { toAdd, toRemove } = collectionMembershipDiff(selected, original);
    if (toAdd.length === 0 && toRemove.length === 0) {
      onClose();
      return;
    }
    if (!assertOnlineForMutation('Updating collections')) return;

    setSaving(true);
    if (toAdd.length > 0) {
      try {
        await ensureRexSaved();
      } catch (e: unknown) {
        setSaving(false);
        if (didAccountFrozenMutationToast(e)) {
          showErrorAfterClose(unknownErrorMessage(e, 'Account is frozen'));
          return;
        }
        showErrorAfterClose('Failed to save', unknownErrorMessage(e, 'Try again.'));
        return;
      }
    }
    try {
      await Promise.all([
        ...toAdd.map((id) =>
          CollectionsApi.addRexToCollection({ collection_id: id, rex_id: rec.id }),
        ),
        ...toRemove.map((id) =>
          CollectionsApi.removeRexFromCollection({ collection_id: id, rex_id: rec.id }),
        ),
      ]);
      invalidateCollectionQueries();
    } catch (e: unknown) {
      setSaving(false);
      if (didAccountFrozenMutationToast(e)) {
        showErrorAfterClose(unknownErrorMessage(e, 'Account is frozen'));
        return;
      }
      showErrorAfterClose('Failed to update collections');
      return;
    }
    setSaving(false);
    onClose();
  }, [
    rec,
    selected,
    original,
    ensureRexSaved,
    invalidateCollectionQueries,
    showErrorAfterClose,
    onClose,
  ]);

  const createAndAdd = useCallback(
    async (name: string) => {
      if (!rec || !name.trim()) return;
      if (!assertOnlineForMutation('Creating collections')) return;
      setCreating(true);
      setError(null);
      try {
        await ensureRexSaved();
        const collection = await CollectionsApi.createCollection({ display_name: name.trim() });
        await CollectionsApi.addRexToCollection({ collection_id: collection.id, rex_id: rec.id });
        queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections] });
        setCreating(false);
        if (onCollectionCreated) {
          onClose();
          onCollectionCreated(collection.display_name);
          return;
        }
        toastSuccessAfterDismiss(
          onClose,
          'New collection added',
          `Added to ${collection.display_name}`,
        );
      } catch (e: unknown) {
        if (didAccountFrozenMutationToast(e)) {
          setCreating(false);
          return;
        }
        setError(unknownErrorMessage(e, 'Failed to create collection'));
        setCreating(false);
      }
    },
    [rec, ensureRexSaved, queryClient, setError, onClose, onCollectionCreated],
  );

  return { saving, creating, applyChanges, createAndAdd };
}
