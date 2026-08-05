import React from 'react';
import { BookmarkMinus } from 'lucide-react-native';
import EditCollectionModal from '~/features/collections/ui/EditCollectionModal';
import DestructiveActionConfirmModal from '~/shared/ui/destructive-confirm/DestructiveActionConfirmModal';
import type { CollectionActionsState } from '~/features/collections/hooks/collection-detail/useCollectionActions';
import type { CollectionDetailRow } from '~/features/collections/types/collection';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  collectionId: string;
  detail: CollectionDetailRow;
  actions: CollectionActionsState;
};

function CollectionDetailOverlays({ collectionId, detail, actions }: Props) {
  return (
    <>
      <EditCollectionModal
        open={actions.showEdit}
        onClose={() => actions.setShowEdit(false)}
        onUpdated={() => actions.setShowEdit(false)}
        collection={{
          id: collectionId,
          display_name: detail.display_name,
          description: detail.description ?? null,
          cover_image_path: detail.cover_image_path ?? null,
          visibility: detail.visibility,
        }}
      />

      <DestructiveActionConfirmModal
        visible={actions.showDeleteConfirm}
        title="Delete collection?"
        message={`"${detail.display_name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        pending={actions.deleting}
        onCancel={() => actions.setShowDeleteConfirm(false)}
        onConfirm={actions.confirmDelete}
      />

      <DestructiveActionConfirmModal
        visible={actions.showUnsaveConfirm}
        title="Remove from saved?"
        message={`"${detail.display_name}" will be removed from your saved collections. You can save it again anytime.`}
        confirmLabel="Remove"
        icon={<BookmarkMinus size={22} color={Theme.colors.destructive} />}
        pending={actions.unsaving}
        onCancel={() => actions.setShowUnsaveConfirm(false)}
        onConfirm={actions.confirmUnsave}
      />
    </>
  );
}

export default CollectionDetailOverlays;
