import React, { useCallback } from 'react';
import { View } from 'react-native';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import WishListItemDetailHost from '~/features/wish-list/ui/detail/WishListItemDetailHost';
import { useDeleteWishListItem } from '~/features/wish-list/hooks/detail/useDeleteWishListItem';
import { useTriedThis } from '~/features/wish-list/hooks/detail/useTriedThis';
import { useWishListItemPage } from '~/pages/wish-list-item/hooks/useWishListItemPage';
import { useWishListItemPageNav } from '~/pages/wish-list-item/hooks/useWishListItemPageNav';
import WishListItemPageBody from '~/pages/wish-list-item/ui/WishListItemPageBody';
import { TAB } from '~/shared/config/mainTabs';
import { openCreateRex } from '~/shared/lib/navigation/createRex';
import { openWishListWizard } from '~/shared/lib/navigation/wishList';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';

function WishListItemPage() {
  const nav = useWishListItemPageNav();
  const page = useWishListItemPage();
  const item = page.item;

  const onNavigateToCreateRex = useCallback(
    (source: AddYourOwnRecSource) => openCreateRex(nav.router, { prefill: source }),
    [nav.router],
  );

  const del = useDeleteWishListItem({
    itemId: item?.id ?? null,
    visible: item != null,
    onDeleted: nav.closeItem,
  });

  const triedThis = useTriedThis({
    item,
    onNavigateToCreateRex,
    onConfirm: nav.closeItem,
    onDeleted: () => {},
  });

  const onEdit = useCallback(() => {
    if (!item) return;
    openWishListWizard(nav.router, { kind: 'edit', item });
  }, [nav.router, item]);

  return (
    <View className="flex-1">
      <DeepLinkShell currentTab={TAB.faves} onTabChange={nav.changeTab} onRexPress={nav.openRex}>
        <WishListItemPageBody page={page} onGoToGems={nav.goToGems} />
      </DeepLinkShell>
      <WishListItemDetailHost
        embedded
        visible={item != null}
        item={item}
        isOwner={page.isOwner}
        onClose={nav.closeItem}
        onDelete={del.openConfirm}
        del={del}
        triedThis={triedThis}
        onEdit={page.isOwner ? onEdit : undefined}
        onTriedThis={page.isOwner ? () => triedThis.open() : undefined}
      />
    </View>
  );
}

export default function ProtectedWishListItemPage() {
  return (
    <ProtectedRoute>
      <WishListItemPage />
    </ProtectedRoute>
  );
}
