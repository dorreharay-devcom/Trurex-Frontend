import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import QueryListFooter from '~/shared/ui/query/QueryListFooter';
import { useUserWishList } from '~/features/wish-list/hooks/useUserWishList';
import { useWishListPageState } from '~/features/wish-list/hooks/gems/useWishListPageState';
import WishListItemRow from '~/features/wish-list/ui/card/WishListItemRow';
import WishListEmpty from '~/features/wish-list/ui/gems-section/WishListEmpty';
import WishListDetailModal from '~/features/wish-list/ui/detail/WishListDetailModal';
import WishListDetailOverlays from '~/features/wish-list/ui/detail/WishListDetailOverlays';
import TriedThisConfirmDialog from '~/features/wish-list/ui/detail/TriedThisConfirmDialog';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';

type Props = {
  userId: string;
  isOwnProfile: boolean;
  onBack: () => void;
  onOpenWishListWizard: (prefill: WishListWizardPrefill | null) => void;
  onNavigateToCreateRex: (source: AddYourOwnRecSource) => void;
};

function UserWishListScreen({
  userId,
  isOwnProfile,
  onBack,
  onOpenWishListWizard,
  onNavigateToCreateRex,
}: Props) {
  const list = useUserWishList({ userId, isOwnProfile });
  const page = useWishListPageState({ onNavigateToCreateRex, onOpenWishListWizard });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="p-4 pb-40"
    >
      <View className="mb-4 flex-row items-center gap-3">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={Theme.colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
          Wish List
        </Text>
      </View>

      {list.loading ? null : list.items.length === 0 ? (
        <WishListEmpty isError={list.isError} onRetry={list.retry} />
      ) : (
        <>
          <View className="gap-3">
            {list.items.map((item) => (
              <WishListItemRow
                key={item.id}
                item={item}
                onPress={() => page.openItem(item)}
                onTriedThis={isOwnProfile ? () => page.openTriedThis(item) : undefined}
              />
            ))}
          </View>
          {list.isFetchNextPageError ? (
            <QueryListFooter isError onRetry={list.fetchNextPage} />
          ) : (
            <LoadMoreButton
              visible={list.hasNextPage}
              loading={list.isFetchingNextPage}
              onPress={list.fetchNextPage}
            />
          )}
        </>
      )}

      <WishListDetailModal
        visible={!!page.selectedItem}
        item={page.selectedItem}
        isOwner={isOwnProfile}
        onClose={page.closeItem}
        onDelete={page.del.openConfirm}
        onEdit={
          isOwnProfile
            ? () => {
                const item = page.selectedItem;
                if (!item) return;
                page.closeItem();
                page.openWizard({ kind: 'edit', item });
              }
            : undefined
        }
      />
      <WishListDetailOverlays item={page.selectedItem} del={page.del} />
      {isOwnProfile ? (
        <TriedThisConfirmDialog
          visible={page.triedThis.confirmOpen}
          onYes={page.triedThis.confirmYes}
          onNo={page.triedThis.confirmNo}
          onClose={page.triedThis.close}
          pending={page.triedThis.pending}
        />
      ) : null}
    </ScrollView>
  );
}

export default UserWishListScreen;
