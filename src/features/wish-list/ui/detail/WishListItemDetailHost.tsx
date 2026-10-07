import React from 'react';
import WishListDetailModal from '~/features/wish-list/ui/detail/WishListDetailModal';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import type { useDeleteWishListItem } from '~/features/wish-list/hooks/detail/useDeleteWishListItem';
import type { useTriedThis } from '~/features/wish-list/hooks/detail/useTriedThis';

type Props = {
  visible: boolean;
  embedded?: boolean;
  item: WishListItemRow | null;
  isOwner: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onTriedThis?: () => void;
  del: ReturnType<typeof useDeleteWishListItem>;
  triedThis: ReturnType<typeof useTriedThis>;
};

function WishListItemDetailHost({ item, ...rest }: Props) {
  if (!item) return null;
  return <WishListDetailModal item={item} {...rest} />;
}

export default WishListItemDetailHost;
