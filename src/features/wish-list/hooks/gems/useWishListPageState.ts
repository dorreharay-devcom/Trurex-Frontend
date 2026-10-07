import { useState } from 'react';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import { useTriedThis } from '~/features/wish-list/hooks/detail/useTriedThis';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';

type Params = {
  onNavigateToCreateRex: (source: AddYourOwnRecSource) => void;
  onOpenWishListWizard: (prefill: WishListWizardPrefill | null) => void;
};

export function useWishListPageState({ onNavigateToCreateRex, onOpenWishListWizard }: Params) {
  const [triedThisTarget, setTriedThisTarget] = useState<WishListItemRow | null>(null);

  const triedThis = useTriedThis({
    item: triedThisTarget,
    onNavigateToCreateRex,
    onDeleted: () => setTriedThisTarget(null),
  });

  return {
    triedThisTarget,
    openTriedThis: setTriedThisTarget,
    triedThis,
    openWizard: onOpenWishListWizard,
  };
}

export type WishListPageState = ReturnType<typeof useWishListPageState>;
