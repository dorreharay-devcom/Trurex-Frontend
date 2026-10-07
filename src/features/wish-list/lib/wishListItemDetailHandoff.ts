import type { WishListItemRow } from '~/features/wish-list/api/types';

export type WishListItemDetailHandoff = {
  item: WishListItemRow;
  isOwner: boolean;
};

let pendingDetail: WishListItemDetailHandoff | null = null;

export function setWishListItemDetail(detail: WishListItemDetailHandoff): void {
  pendingDetail = detail;
}

export function takeWishListItemDetail(): WishListItemDetailHandoff | null {
  const next = pendingDetail;
  pendingDetail = null;
  return next;
}
