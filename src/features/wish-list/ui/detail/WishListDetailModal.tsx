import React from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { OverlayModal } from '~/shared/ui/overlay/OverlayModal';
import { useOverlaySheetPresentation } from '~/shared/hooks/useOverlaySheetPresentation';
import DetailHeader from '~/features/rex-detail/ui/common/DetailHeader';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import WishListDetailTags from '~/features/wish-list/ui/detail/WishListDetailTags';

type Props = {
  visible: boolean;
  embedded?: boolean;
  item: WishListItemRow | null;
  isOwner: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete: () => void;
};

function WishListDetailModal({
  visible,
  embedded = false,
  item,
  isOwner,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const { height: windowHeight } = useWindowDimensions();
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
                  categoryIcon="🛍️"
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
                <View className="flex-row flex-wrap gap-6">
                  {item.size ? (
                    <View className="gap-1">
                      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Size
                      </Text>
                      <Text className="text-sm text-foreground">{item.size}</Text>
                    </View>
                  ) : null}
                  {item.colour ? (
                    <View className="gap-1">
                      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Colour
                      </Text>
                      <Text className="text-sm text-foreground">{item.colour}</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {item.note ? (
                <Text className="text-base leading-relaxed text-foreground">{item.note}</Text>
              ) : null}

              <WishListDetailTags tags={item.tags} />

              {item.source_rex_place_name ? (
                <Text className="text-sm text-muted-foreground">
                  Added from your review of {item.source_rex_place_name}
                </Text>
              ) : null}
            </View>
          </ScrollView>
        ) : null}
      </View>
    </OverlayModal>
  );
}

export default WishListDetailModal;
