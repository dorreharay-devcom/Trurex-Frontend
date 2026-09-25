import type { WishListItemRow } from '~/features/wish-list/api/types';

export type WishListWizardPrefill =
  | { kind: 'fromRex'; sourceRexId: string; brandName: string; productName: string | null }
  | { kind: 'edit'; item: WishListItemRow };
