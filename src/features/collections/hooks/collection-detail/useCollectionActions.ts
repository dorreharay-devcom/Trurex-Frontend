import { useCallback, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import {
  useDeleteCollection,
  useSaveCollection,
  useUnsaveCollection,
} from '~/features/collections/hooks/data/useCollectionMutations';
import type { CollectionDetailRow } from '~/features/collections/types/collection';
import { toastError, toastSuccessAfterDismiss } from '~/shared/lib/appToast';
import { buildShareUrl, shareMobileLink } from '~/shared/lib/share';
import { toCollectionRoute } from '~/shared/lib/navigation/openCollection';
import { isWeb } from '~/shared/lib/ui/platform';

type Params = {
  collectionId: string;
  detail: CollectionDetailRow | undefined;
  onBack: () => void;
};

export function useCollectionActions({ collectionId, detail, onBack }: Params) {
  const deleteMutation = useDeleteCollection();
  const { mutate: save } = useSaveCollection();
  const { mutate: unsave, isPending: unsaving } = useUnsaveCollection();

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const isSaved = savedOverride ?? detail?.is_saved ?? false;

  const shareCollection = useCallback(async () => {
    if (!detail) return;
    const url = buildShareUrl(toCollectionRoute(collectionId));
    if (isWeb) {
      await Clipboard.setStringAsync(url);
      toastSuccessAfterDismiss(() => setShowMenu(false), 'Link copied!');
      return;
    }
    setShowMenu(false);
    await shareMobileLink({
      title: detail.display_name,
      message: `Check out "${detail.display_name}" on TruRex`,
      url,
    }).catch(() => {
      toastError('Share failed', 'Could not open sharing options. Try again.');
    });
  }, [detail, collectionId]);

  const toggleSaved = useCallback(() => {
    setShowMenu(false);
    if (isSaved) {
      setShowUnsaveConfirm(true);
      return;
    }
    setSavedOverride(true);
    save(collectionId, { onError: () => setSavedOverride(false) });
  }, [isSaved, save, collectionId]);

  const confirmDelete = useCallback(() => {
    deleteMutation.mutate(collectionId, { onSuccess: onBack });
  }, [deleteMutation, collectionId, onBack]);

  const confirmUnsave = useCallback(() => {
    unsave(collectionId, {
      onSuccess: () => {
        setShowUnsaveConfirm(false);
        setSavedOverride(false);
        onBack();
      },
    });
  }, [unsave, collectionId, onBack]);

  return {
    showMenu,
    setShowMenu,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showEdit,
    setShowEdit,
    showUnsaveConfirm,
    setShowUnsaveConfirm,
    isSaved,
    deleting: deleteMutation.isPending,
    unsaving,
    shareCollection,
    toggleSaved,
    confirmDelete,
    confirmUnsave,
  };
}

export type CollectionActionsState = ReturnType<typeof useCollectionActions>;
