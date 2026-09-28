import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import HeaderOverflowMenu from './HeaderOverflowMenu';

type Props = {
  isOwner: boolean;
  showReport: boolean;
  canAddToWishList?: boolean;
  onBack: () => void;
  onEdit: (() => void) | undefined;
  onDelete: () => void;
  onReport: () => void;
  onAddToWishList?: (() => void) | undefined;
};

function DetailHeader({
  isOwner,
  showReport,
  canAddToWishList = false,
  onBack,
  onEdit,
  onDelete,
  onReport,
  onAddToWishList,
}: Props) {
  return (
    <View
      className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6"
      style={!isWeb ? { position: 'relative', zIndex: 50, elevation: 50 } : undefined}
    >
      <View className="flex-row items-center">
        <View className="w-[60px] items-start justify-center">
          <Pressable
            onPress={onBack}
            className="flex-row items-center gap-1.5 rounded-lg py-0.5 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft size={20} color={Theme.colors.secondaryText} />
            <Text className="text-sm font-medium text-foreground">Back</Text>
          </Pressable>
        </View>
        <View className="min-w-0 flex-1" />
        <View className="w-[60px] shrink-0 items-end justify-center">
          <HeaderOverflowMenu
            isOwner={isOwner}
            showReport={showReport}
            canAddToWishList={canAddToWishList}
            onEdit={onEdit}
            onDelete={onDelete}
            onReport={onReport}
            onAddToWishList={onAddToWishList}
          />
        </View>
      </View>
    </View>
  );
}

export default DetailHeader;
