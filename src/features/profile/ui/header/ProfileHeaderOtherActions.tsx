import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Share2 } from 'lucide-react-native';
import type { RelationshipStatus } from '~/features/profile/types/profile';
import { RELATIONSHIP_STATUS } from '~/shared/config/relationshipStatus';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  relationshipStatus: RelationshipStatus;
  followLoading: boolean;
  blockLoading: boolean;
  isBlocked: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onShare: () => void;
  onBlockPress?: () => void;
  onUnblockPress?: () => void;
};

function isFollowingStatus(status: RelationshipStatus): boolean {
  return status === RELATIONSHIP_STATUS.following || status === RELATIONSHIP_STATUS.trusted;
}

const ProfileHeaderOtherActions = ({
  relationshipStatus,
  followLoading,
  blockLoading,
  isBlocked,
  onFollow,
  onUnfollow,
  onShare,
  onBlockPress,
  onUnblockPress,
}: Props) => {
  const following = isFollowingStatus(relationshipStatus);
  const actionsBusy = followLoading || blockLoading;

  const onFollowPress = () => {
    if (following) {
      onUnfollow?.();
      return;
    }
    onFollow?.();
  };

  const onBlockPressResolved = () => {
    if (isBlocked) {
      onUnblockPress?.();
      return;
    }
    onBlockPress?.();
  };

  return (
    <View className="mb-2 mt-4 flex-row gap-2">
      <TouchableOpacity
        onPress={onFollowPress}
        disabled={actionsBusy}
        activeOpacity={0.8}
        className={`flex-1 items-center justify-center rounded-lg py-2.5 ${
          following ? 'border border-border bg-card' : 'bg-primary'
        }`}
      >
        {followLoading ? (
          <ActivityIndicator
            size="small"
            color={following ? Theme.colors.foreground : Theme.colors.primaryForeground}
          />
        ) : (
          <Text
            className={`text-sm font-bold ${
              following ? 'text-foreground' : 'text-primary-foreground'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onShare}
        activeOpacity={0.7}
        className="flex-row items-center gap-1.5 rounded-lg border border-border px-4 py-2.5"
      >
        <Share2 size={15} color={Theme.colors.foreground} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onBlockPressResolved}
        disabled={blockLoading}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={isBlocked ? 'Unblock user' : 'Block user'}
        className="min-w-[88px] items-center justify-center rounded-lg border border-border px-3 py-2.5"
      >
        {blockLoading ? (
          <ActivityIndicator size="small" color={Theme.colors.destructive} />
        ) : (
          <Text
            className={`text-sm font-medium ${isBlocked ? 'text-foreground' : 'text-destructive'}`}
          >
            {isBlocked ? 'Unblock' : 'Block'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeaderOtherActions;
