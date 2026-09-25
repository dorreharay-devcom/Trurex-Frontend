import React from 'react';
import DestructiveActionConfirmModal from '~/shared/ui/destructive-confirm/DestructiveActionConfirmModal';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import type { useDeleteWishListItem } from '~/features/wish-list/hooks/detail/useDeleteWishListItem';

const DELETE_WISH_LIST_ITEM_MESSAGE = "This removes it from your Wish List. This can't be undone.";

type Props = {
  item: WishListItemRow | null;
  del: ReturnType<typeof useDeleteWishListItem>;
};

function WishListDetailOverlays({ del }: Props) {
  return (
    <DestructiveActionConfirmModal
      visible={del.confirmOpen}
      title="Delete this item?"
      message={DELETE_WISH_LIST_ITEM_MESSAGE}
      confirmLabel="Delete"
      pending={del.pending}
      onCancel={del.closeConfirm}
      onConfirm={del.confirmDelete}
    />
  );
}

export default WishListDetailOverlays;
