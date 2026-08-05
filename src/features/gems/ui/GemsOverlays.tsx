import React from 'react';
import CreateCollectionModal from '~/features/collections/ui/CreateCollectionModal';
import AddToCollectionSheet from '~/features/collections/ui/AddToCollectionSheet';
import { DestructiveActionConfirmModal } from '~/shared/ui/DestructiveActionConfirmModal';
import type { GemsPageState } from '~/features/gems/hooks/useGemsPageState';
import type { RemoveUncollectedState } from '~/features/gems/hooks/useRemoveUncollected';

type Props = {
  page: GemsPageState;
  removeUncollected: RemoveUncollectedState;
};

function removeUncollectedMessage(target: RemoveUncollectedState['target']) {
  if (!target) return '';
  return `"${target.title}" will be removed from Uncollected Rex. You can save it again from Discover.`;
}

function GemsOverlays({ page, removeUncollected }: Props) {
  return (
    <>
      <DestructiveActionConfirmModal
        visible={removeUncollected.target != null}
        title="Remove from saved?"
        message={removeUncollectedMessage(removeUncollected.target)}
        confirmLabel="Remove"
        pending={removeUncollected.pending}
        onCancel={removeUncollected.cancel}
        onConfirm={() => void removeUncollected.confirm()}
      />

      <CreateCollectionModal
        open={page.showCreateCollection}
        onClose={page.closeCreateCollection}
        onCreated={page.onCollectionCreated}
      />

      <AddToCollectionSheet
        open={!!page.addToCollectionRec}
        rec={page.addToCollectionRec}
        onClose={page.closeAddToCollection}
      />
    </>
  );
}

export default GemsOverlays;
