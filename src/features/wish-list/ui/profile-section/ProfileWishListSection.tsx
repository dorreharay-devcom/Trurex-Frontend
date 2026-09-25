import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import {
  PROFILE_WISH_LIST_PREVIEW_LIMIT,
  useProfileWishList,
} from '~/features/wish-list/hooks/useProfileWishList';
import type { ProfileData } from '~/features/profile/types/profile';
import { RELATIONSHIP_STATUS } from '~/shared/config/relationshipStatus';

function wishListSubtitle(count: number, atCap: boolean): string {
  if (count === 0) return 'Nothing saved yet';
  if (atCap) return `${count}+ items saved`;
  if (count === 1) return '1 item saved';
  return `${count} items saved`;
}

type Props = {
  profile: ProfileData;
  isOwnProfile: boolean;
  onOpenWishList: () => void;
};

function ProfileWishListSection({ profile, isOwnProfile, onOpenWishList }: Props) {
  const canView = isOwnProfile || profile.relationshipStatus === RELATIONSHIP_STATUS.trusted;
  const { items, isLoading } = useProfileWishList({
    userId: profile.userId,
    isOwnProfile,
    enabled: canView,
  });

  if (!canView) return null;
  if (!isLoading && items.length === 0) return null;

  return (
    <View className="px-4 pb-1 pt-3">
      <TouchableOpacity
        onPress={onOpenWishList}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Wish List"
        className="flex-row items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5"
      >
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-sm font-medium text-foreground">Wish List</Text>
          <Text className="text-xs text-muted-foreground">
            {wishListSubtitle(items.length, items.length >= PROFILE_WISH_LIST_PREVIEW_LIMIT)}
          </Text>
        </View>
        <ChevronRight size={18} color={Theme.colors.muted} />
      </TouchableOpacity>
    </View>
  );
}

export default ProfileWishListSection;
