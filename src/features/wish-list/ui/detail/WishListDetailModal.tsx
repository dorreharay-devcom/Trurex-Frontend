import React from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { OverlayModal } from '~/shared/ui/overlay/OverlayModal';
import { useOverlaySheetPresentation } from '~/shared/hooks/useOverlaySheetPresentation';
import { Button } from '~/shared/ui/primitives/Button';
import DetailHeader from '~/features/rex-detail/ui/common/DetailHeader';
import DestructiveActionConfirmModal from '~/shared/ui/destructive-confirm/DestructiveActionConfirmModal';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { useCategoryIcon } from '~/shared/hooks/useActiveCategories';
import { PRODUCT_BRAND_CATEGORY_CODE } from '~/features/wish-list/config/rexBridge';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import type { useDeleteWishListItem } from '~/features/wish-list/hooks/detail/useDeleteWishListItem';
import type { useTriedThis } from '~/features/wish-list/hooks/detail/useTriedThis';
import TriedThisConfirmDialog from '~/features/wish-list/ui/detail/TriedThisConfirmDialog';
import WishListDetailTags from '~/features/wish-list/ui/detail/WishListDetailTags';

const DELETE_WISH_LIST_ITEM_MESSAGE = "This removes it from your Wish List. This can't be undone.";

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

function WishListDetailModal({
  visible,
  embedded = false,
  item,
  isOwner,
  onClose,
  onEdit,
  onDelete,
  onTriedThis,
  del,
  triedThis,
}: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const categoryIcon = useCategoryIcon(PRODUCT_BRAND_CATEGORY_CODE);
  const { sheetTranslateY, handleClose } = useOverlaySheetPresentation({
    visible,
    windowHeight,
    onClose,
  });

  return (
    <OverlayModal
      embedded={embedded}
      visible={visible}
      onRequestClose={handleClose}
      contentTranslateY={sheetTranslateY}
    >
      <View className="flex-1 min-h-0 flex-col">
        <DetailHeader
          isOwner={isOwner}
          showReport={false}
          onBack={handleClose}
          onEdit={isOwner ? onEdit : undefined}
          onDelete={onDelete}
          onReport={() => {}}
        />
        {item ? (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="items-center pb-8"
          >
            <View className={`${CREATE_REC_STEP_INNER} gap-5`}>
              {item.photo_path ? (
                <View className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                  <SignedStorageImage
                    bucket={REX_IMAGES_BUCKET}
                    storagePath={item.photo_path}
                    className="h-full w-full"
                    contentFit="cover"
                    skeletonUntilLoaded
                    accessibilityLabel={item.brand_name}
                  />
                </View>
              ) : (
                <RexPhotoPlaceholder
                  categoryIcon={categoryIcon}
                  className="aspect-[16/9] w-full rounded-xl"
                  emojiSize={54}
                  accessibilityLabel={item.brand_name}
                />
              )}

              <View>
                <Text className="font-display text-2xl font-bold text-foreground">
                  {item.brand_name}
                </Text>
                {item.product_name ? (
                  <Text className="mt-1 text-base text-muted-foreground">{item.product_name}</Text>
                ) : null}
              </View>

              {item.size || item.colour ? (
                <View className="flex-row flex-wrap gap-3">
                  {item.size ? (
                    <View className="min-w-[100px] gap-1 rounded-xl border border-border p-3">
                      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Size
                      </Text>
                      <Text className="text-sm text-foreground">{item.size}</Text>
                    </View>
                  ) : null}
                  {item.colour ? (
                    <View className="min-w-[100px] gap-1 rounded-xl border border-border p-3">
                      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Colour
                      </Text>
                      <Text className="text-sm text-foreground">{item.colour}</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {item.note ? (
                <View className="gap-2">
                  <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Personal note
                  </Text>
                  <Text className="text-base leading-relaxed text-foreground">{item.note}</Text>
                </View>
              ) : null}

              <View className="h-px bg-border" />

              <WishListDetailTags tags={item.tags} />

              {item.source_rex_place_name ? (
                <Text className="text-sm text-muted-foreground">
                  Added from your review of {item.source_rex_place_name}
                </Text>
              ) : null}

              {isOwner && onTriedThis ? (
                <Button title="I've tried this now" onPress={onTriedThis} className="w-full" />
              ) : null}
            </View>
          </ScrollView>
        ) : null}
      </View>
      <DestructiveActionConfirmModal
        inline
        visible={del.confirmOpen}
        title="Delete this item?"
        message={DELETE_WISH_LIST_ITEM_MESSAGE}
        confirmLabel="Delete"
        pending={del.pending}
        onCancel={del.closeConfirm}
        onConfirm={del.confirmDelete}
      />
      <TriedThisConfirmDialog
        embedded
        visible={triedThis.confirmOpen}
        onYes={triedThis.confirmYes}
        onNo={triedThis.confirmNo}
        onClose={triedThis.close}
        pending={triedThis.pending}
      />
    </OverlayModal>
  );
}

export default WishListDetailModal;
