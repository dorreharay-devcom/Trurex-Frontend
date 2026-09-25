import type { Href } from 'expo-router';
import { setWishListPrefill } from '~/features/wish-list/lib/wishListPrefillHandoff';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';
import { toCreateWishListItemRoute, toUserWishListRoute } from '~/shared/config/routes';

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
