import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LogOut, Share2 } from 'lucide-react-native';
import { shareProfile } from '~/features/profile/lib/share';
import ProfileHeaderAvatar from '~/features/profile/ui/header/ProfileHeaderAvatar';
import ProfileHeaderIdentity from '~/features/profile/ui/header/ProfileHeaderIdentity';
import ProfileHeaderOtherActions from '~/features/profile/ui/header/ProfileHeaderOtherActions';
import type { ProfileData } from '~/features/profile/types/profile';
import { Theme } from '~/shared/theme/Theme';
import { useRexScoreTiers } from '~/features/rex-score/hooks/useRexScoreTiers';
import ProfileTierBadge from '~/features/rex-score/ui/ProfileTierBadge';

type Props = {
  profile: ProfileData;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onSignOut?: () => void;
  onAvatarPress?: () => void;
  avatarUploading?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  followLoading?: boolean;
  avatarRefreshKey?: number;
  isBlocked?: boolean;
  onBlockPress?: () => void;
  onUnblockPress?: () => void;
  blockLoading?: boolean;
};

const ProfileHeader = ({
  profile,
  isOwnProfile = false,
  onEditProfile,
  onSignOut,
  onAvatarPress,
  avatarUploading = false,
  onFollow,
  onUnfollow,
  followLoading = false,
  avatarRefreshKey,
  isBlocked = false,
  onBlockPress,
  onUnblockPress,
  blockLoading = false,
}: Props) => {
  const onShare = () => void shareProfile(profile, isOwnProfile);
  const { getTier, isTopTier } = useRexScoreTiers();
  const tier = getTier(profile.rexTier);

  return (
    <View className="overflow-hidden rounded-t-xl bg-card">
      <View className="px-4 pt-5">
        <View className="self-start">
          <ProfileHeaderAvatar
            displayName={profile.displayName}
            avatarUrl={profile.avatarUrl}
            editable={isOwnProfile}
            disabled={!isOwnProfile || avatarUploading}
            avatarRefreshKey={avatarRefreshKey}
            onPress={onAvatarPress}
          />
        </View>

        <ProfileHeaderIdentity
          displayName={profile.displayName}
          handle={profile.handle}
          bio={profile.bio}
          location={profile.location}
          relationshipStatus={profile.relationshipStatus}
          tierBadge={
            tier ? (
              <ProfileTierBadge
                tier={tier}
                isTopTier={isTopTier(tier.code)}
                tappable={isOwnProfile}
              />
            ) : null
          }
        />

        {isOwnProfile ? (
          <View className="mb-2 mt-4 flex-row gap-2">
            {onEditProfile ? (
              <TouchableOpacity
                onPress={onEditProfile}
                activeOpacity={0.7}
                className="flex-1 items-center rounded-lg border border-border py-2.5"
                accessibilityRole="button"
                accessibilityLabel="Edit Profile"
              >
                <Text className="text-sm font-medium text-foreground">Edit Profile</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={onShare}
              activeOpacity={0.7}
              className="flex-row items-center gap-1.5 rounded-lg border border-border px-4 py-2.5"
            >
              <Share2 size={15} color={Theme.colors.foreground} />
              <Text className="text-sm font-medium text-foreground">Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSignOut}
              activeOpacity={0.7}
              className="items-center justify-center rounded-lg border border-destructive px-3 py-2.5"
              accessibilityRole="button"
              accessibilityLabel="Log out"
            >
              <LogOut size={16} color={Theme.colors.destructive} />
            </TouchableOpacity>
          </View>
        ) : (
          <ProfileHeaderOtherActions
            relationshipStatus={profile.relationshipStatus}
            followLoading={followLoading}
            blockLoading={blockLoading}
            isBlocked={isBlocked}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            onShare={onShare}
            onBlockPress={onBlockPress}
            onUnblockPress={onUnblockPress}
          />
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
