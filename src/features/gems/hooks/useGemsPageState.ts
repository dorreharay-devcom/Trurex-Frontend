import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import { toRecSummary } from '~/features/collections/lib/mappers';
import type { RecSummary } from '~/features/collections/types/recSummary';
import type { Recommendation } from '~/shared/types/recommendation';

type Params = {
  onOpenCollection?: (collectionId: string) => void;
};

export function useGemsPageState({ onOpenCollection }: Params = {}) {
  const queryClient = useQueryClient();
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [addToCollectionRec, setAddToCollectionRec] = useState<RecSummary | null>(null);

  const invalidateMyCollections = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections] });
  }, [queryClient]);

  const openCollection = useCallback(
    (id: string) => {
      onOpenCollection?.(id);
    },
    [onOpenCollection],
  );

  const openCreateCollection = useCallback(() => setShowCreateCollection(true), []);
  const closeCreateCollection = useCallback(() => setShowCreateCollection(false), []);

  const onCollectionCreated = useCallback(
    (id: string) => {
      setShowCreateCollection(false);
      invalidateMyCollections();
      onOpenCollection?.(id);
    },
    [invalidateMyCollections, onOpenCollection],
  );

  const openAddToCollection = useCallback((rec: Recommendation) => {
    setAddToCollectionRec(toRecSummary(rec));
  }, []);

  const closeAddToCollection = useCallback(() => {
    setAddToCollectionRec(null);
    invalidateMyCollections();
  }, [invalidateMyCollections]);

  return {
    openCollection,
    showCreateCollection,
    openCreateCollection,
    closeCreateCollection,
    onCollectionCreated,
    addToCollectionRec,
    openAddToCollection,
    closeAddToCollection,
  };
}

export type GemsPageState = ReturnType<typeof useGemsPageState>;
