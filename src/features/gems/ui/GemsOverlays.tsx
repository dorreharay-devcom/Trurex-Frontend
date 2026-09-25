import React from 'react';
import CreateCollectionModal from '~/features/collections/ui/CreateCollectionModal';
import AddToCollectionSheet from '~/features/collections/ui/AddToCollectionSheet';
import DestructiveActionConfirmModal from '~/shared/ui/destructive-confirm/DestructiveActionConfirmModal';
import type { GemsPageState } from '~/features/gems/hooks/useGemsPageState';
import type { RemoveUncollectedState } from '~/features/gems/hooks/useRemoveUncollected';
import type { WishListPageState } from '~/features/wish-list/hooks/gems/useWishListPageState';
import TriedThisConfirmDialog from '~/features/wish-list/ui/detail/TriedThisConfirmDialog';
import WishListDetailModal from '~/features/wish-list/ui/detail/WishListDetailModal';
import WishListDetailOverlays from '~/features/wish-list/ui/detail/WishListDetailOverlays';

type Props = {
  page: GemsPageState;
  removeUncollected: RemoveUncollectedState;
  wishListPage: WishListPageState;
};

function removeUncollectedMessage(target: RemoveUncollectedState['target']) {
  if (!target) return '';
  return `"${target.title}" will be removed from Uncollected Rex. You can save it again from Discover.`;
}

function GemsOverlays({ page, removeUncollected, wishListPage }: Props) {
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

      <WishListDetailModal
        visible={!!wishListPage.selectedItem}
        item={wishListPage.selectedItem}
        isOwner
        onClose={wishListPage.closeItem}
        onDelete={wishListPage.del.openConfirm}
        onEdit={() => {
          const item = wishListPage.selectedItem;
          if (!item) return;
          wishListPage.closeItem();
          wishListPage.openWizard({ kind: 'edit', item });
        }}
      />
      <WishListDetailOverlays item={wishListPage.selectedItem} del={wishListPage.del} />
      <TriedThisConfirmDialog
        visible={wishListPage.triedThis.confirmOpen}
        onYes={wishListPage.triedThis.confirmYes}
        onNo={wishListPage.triedThis.confirmNo}
        onClose={wishListPage.triedThis.close}
        pending={wishListPage.triedThis.pending}
      />
    </>
  );
}

export default GemsOverlays;
