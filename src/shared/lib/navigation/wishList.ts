import type { Href } from 'expo-router';
import { setWishListPrefill } from '~/features/wish-list/lib/wishListPrefillHandoff';
import { setWishListItemDetail } from '~/features/wish-list/lib/wishListItemDetailHandoff';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import {
  toCreateWishListItemRoute,
  toUserWishListRoute,
  toWishListItemRoute,
} from '~/shared/config/routes';

type Router = {
  push: (href: Href) => void;
};

export function openWishListWizard(router: Router, prefill?: WishListWizardPrefill | null): void {
  if (prefill) setWishListPrefill(prefill);
  router.push(toCreateWishListItemRoute());
}

export function openUserWishList(router: Router, userId: string): void {
  router.push(toUserWishListRoute(userId));
}

export function openWishListItem(router: Router, item: WishListItemRow, isOwner: boolean): void {
  setWishListItemDetail({ item, isOwner });
  router.push(toWishListItemRoute(item.id));
}
