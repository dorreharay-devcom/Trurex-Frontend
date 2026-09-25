import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';

let pendingPrefill: WishListWizardPrefill | null = null;

export function setWishListPrefill(prefill: WishListWizardPrefill): void {
  pendingPrefill = prefill;
}

export function takeWishListPrefill(): WishListWizardPrefill | null {
  const next = pendingPrefill;
  pendingPrefill = null;
  return next;
}
