import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { useProfileWishList } from '~/features/wish-list/hooks/useProfileWishList';
import type { ProfileData } from '~/features/profile/types/profile';
import { RELATIONSHIP_STATUS } from '~/shared/config/relationshipStatus';

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
        className="flex-row items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5"
      >
        <Text className="text-2xl">🎁</Text>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-sm font-medium text-foreground">Wishlist</Text>
          <Text className="text-xs text-muted-foreground">Things I got my eye on</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-foreground">View all</Text>
          <ChevronRight size={18} color={Theme.colors.muted} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileWishListSection;
