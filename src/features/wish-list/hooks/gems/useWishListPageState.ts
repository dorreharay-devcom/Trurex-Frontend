import { useCallback, useState } from 'react';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import { useDeleteWishListItem } from '~/features/wish-list/hooks/detail/useDeleteWishListItem';
import { useTriedThis } from '~/features/wish-list/hooks/detail/useTriedThis';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';

type Params = {
  onNavigateToCreateRex: (source: AddYourOwnRecSource) => void;
  onOpenWishListWizard: (prefill: WishListWizardPrefill | null) => void;
};

export function useWishListPageState({ onNavigateToCreateRex, onOpenWishListWizard }: Params) {
  const [selectedItem, setSelectedItem] = useState<WishListItemRow | null>(null);
  const [triedThisTarget, setTriedThisTarget] = useState<WishListItemRow | null>(null);

  const closeItem = useCallback(() => setSelectedItem(null), []);

  const del = useDeleteWishListItem({
    itemId: selectedItem?.id ?? null,
    visible: !!selectedItem,
    onDeleted: () => setSelectedItem(null),
  });

  const triedThis = useTriedThis({
    item: triedThisTarget,
    onNavigateToCreateRex,
    onDeleted: () => setTriedThisTarget(null),
  });

  return {
    selectedItem,
    openItem: setSelectedItem,
    closeItem,
    del,
    triedThisTarget,
    openTriedThis: setTriedThisTarget,
    triedThis,
    openWizard: onOpenWishListWizard,
  };
}

export type WishListPageState = ReturnType<typeof useWishListPageState>;
