import { useCallback, useEffect, useState } from 'react';
import { CollectionsApi } from '~/features/collections/api/collectionsApi';
import { useSelectionSet } from '~/features/collections/hooks/common/useSelectionSet';
import { useAuth } from '~/features/auth/providers';
import type { UserCollection } from '~/features/collections/types/collection';
import type { RecSummary } from '~/features/collections/types/recSummary';

export type CollectionWithCount = UserCollection & { item_count: number };

export function useCollectionPicker(open: boolean, rec: RecSummary | null) {
  const { user } = useAuth();
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [original, setOriginal] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selection = useSelectionSet();
  const { replace, reset } = selection;

  const load = useCallback(async () => {
    if (!user || !rec) return;
    setLoading(true);
    setError(null);
    try {
      const [cols, existingIds] = await Promise.all([
        CollectionsApi.userCollections(user.id),
        CollectionsApi.myCollectionIdsForRex(rec.id),
      ]);
      const existingSet = new Set(existingIds);
      setOriginal(existingSet);
      replace(existingSet);
      setCollections(cols.map((c) => ({ ...c, item_count: c.rex_count ?? 0 })));
    } catch {
      setError('Failed to load collections');
    }
    setLoading(false);
  }, [user, rec, replace]);

  useEffect(() => {
    if (!open || !rec) return;
    reset();
    setOriginal(new Set());
    setError(null);
    void load();
  }, [open, rec, reset, load]);

  return {
    collections,
    selected: selection.selected,
    original,
    loading,
    error,
    setError,
    toggle: selection.toggle,
    reload: load,
  };
}

export type CollectionPickerState = ReturnType<typeof useCollectionPicker>;
