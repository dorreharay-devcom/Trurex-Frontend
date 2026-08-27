import { useCallback, useState } from 'react';
import { useShareCollectionToFeed } from '~/features/collections/hooks/data/useCollectionMutations';
import type { CollectionVisibility } from '~/features/collections/types/collection';
import { toastSuccessAfterDismiss } from '~/shared/lib/appToast';

export function useShareToFeedPrompt() {
  const [pendingCollectionId, setPendingCollectionId] = useState<string | null>(null);
  const shareMutation = useShareCollectionToFeed();

  const promptIfPublic = useCallback(
    (collectionId: string, visibility: CollectionVisibility | undefined): boolean => {
      if (visibility !== 'public') return false;
      setPendingCollectionId(collectionId);
      return true;
    },
    [],
  );

  const resolve = useCallback(
    (share: boolean, onDone: (collectionId: string) => void) => {
      const collectionId = pendingCollectionId;
      if (!collectionId) return;
      setPendingCollectionId(null);
      if (!share) {
        onDone(collectionId);
        return;
      }
      shareMutation.mutate(collectionId, {
        onSuccess: () => {
          toastSuccessAfterDismiss(() => onDone(collectionId), 'Shared to the Discover feed');
        },
        onError: () => onDone(collectionId),
      });
    },
    [pendingCollectionId, shareMutation],
  );

  return {
    open: pendingCollectionId !== null,
    pending: shareMutation.isPending,
    promptIfPublic,
    resolve,
  };
}

export type ShareToFeedPromptState = ReturnType<typeof useShareToFeedPrompt>;
