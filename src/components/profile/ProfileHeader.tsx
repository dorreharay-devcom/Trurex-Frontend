import React from 'react';
import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Share2, Camera, LogOut } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { toastSuccess } from '~/utils/appToast';
import { buildProfileShareUrl, profileShareSlug } from '~/utils/profileShareUrl';
import { shareMobileLink } from '~/utils/mobileShare';
import { Theme } from '~/theme/Theme';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { USER_AVATARS_BUCKET } from '~/constants/storageBuckets';
import type { ProfileData } from '~/types/profile';

export type { ProfileData };

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile?: boolean;
  isGuest?: boolean;
  onEditProfile?: () => void;
  onSignOut?: () => void;
  onAvatarPress?: () => void;
  avatarUploading?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onGuestAction?: () => void;
  followLoading?: boolean;
  avatarRefreshKey?: number;
}

const ProfileHeader = ({
  profile,
  isOwnProfile = false,
  isGuest = false,
  onEditProfile,
  onSignOut,
  onAvatarPress,
  avatarUploading = false,
  onFollow,
  onUnfollow,
  onGuestAction,
  followLoading = false,
  avatarRefreshKey,
}: ProfileHeaderProps) => {
  const handleShare = async () => {
    const slug = profileShareSlug(profile);
    const url = buildProfileShareUrl(slug);
    const name = profile.displayName || 'someone';
    try {
      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(url);
        toastSuccess('Link copied!');
      } else {
        await shareMobileLink({
          title: 'TruRex Profile',
          message: `Check out ${isOwnProfile ? 'my' : `${name}'s`} profile on TruRex`,
          url,
        });
      }
    } catch {}
  };

  return (
    <View className="overflow-hidden rounded-t-xl bg-card">
      <View className="px-4 pt-5">
        {/* Avatar */}
        <View className="self-start">
          <TouchableOpacity
            onPress={isOwnProfile ? onAvatarPress : undefined}
            activeOpacity={isOwnProfile ? 0.8 : 1}
            disabled={avatarUploading}
          >
            <View className="w-24 h-24 rounded-2xl bg-muted overflow-hidden border-4 border-border">
              {profile.avatarUrl ? (
                <SignedStorageImage
                  bucket={USER_AVATARS_BUCKET}
                  storagePath={profile.avatarUrl}
                  className="w-full h-full"
                  cacheVersion={avatarRefreshKey}
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-3xl font-bold text-muted">
                    {profile.displayName?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              {isOwnProfile && (
                <View className="absolute bottom-0 left-0 right-0 items-center justify-center py-1.5 bg-black/45">
                  <Camera size={14} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Name & info */}
        <View className="mt-3">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text className="text-xl font-bold text-foreground">{profile.displayName}</Text>
            {profile.relationshipStatus && (
              <View
                className="px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    profile.relationshipStatus === 'trusted'
                      ? Theme.colors.primary
                      : Theme.colors.secondary,
                }}
              >
                <Text
                  className="text-[10px] font-bold uppercase"
                  style={{
                    color:
                      profile.relationshipStatus === 'trusted'
                        ? Theme.colors.primaryForeground
                        : Theme.colors.secondaryForeground,
                  }}
                >
                  {profile.relationshipStatus.replace('_', ' ')}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-muted-foreground">{profile.handle}</Text>
          {!!profile.bio && (
            <Text className="text-sm mt-2 leading-relaxed" style={{ color: 'rgba(0,0,0,0.8)' }}>
              {profile.bio}
            </Text>
          )}
          {!!profile.location && (
            <Text className="text-xs text-muted-foreground mt-1.5">📍 {profile.location}</Text>
          )}
        </View>

        {/* Action buttons */}
        {isOwnProfile ? (
          <View className="flex-row gap-2 mt-4 mb-2">
            <TouchableOpacity
              onPress={onEditProfile}
              activeOpacity={0.7}
              className="flex-1 py-2.5 rounded-lg border border-border items-center"
            >
              <Text className="text-sm font-medium text-foreground">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              activeOpacity={0.7}
              className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border"
            >
              <Share2 size={15} color={Theme.colors.foreground} />
              <Text className="text-sm font-medium text-foreground">Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSignOut}
              activeOpacity={0.7}
              className="py-2.5 px-3 rounded-lg border border-border items-center justify-center"
            >
              <LogOut size={16} color={Theme.colors.muted} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row gap-2 mt-4 mb-2">
            {(() => {
              const isFollowing =
                profile.relationshipStatus === 'following' ||
                profile.relationshipStatus === 'trusted';
              return (
                <TouchableOpacity
                  onPress={isGuest ? onGuestAction : isFollowing ? onUnfollow : onFollow}
                  disabled={followLoading}
                  activeOpacity={0.8}
                  className={`flex-1 py-2.5 rounded-lg items-center justify-center ${isFollowing && !isGuest ? 'border border-border bg-card' : 'bg-primary'}`}
                >
                  {followLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={isFollowing ? Theme.colors.foreground : Theme.colors.primaryForeground}
                    />
                  ) : (
                    <Text
                      className={`text-sm font-bold ${isFollowing && !isGuest ? 'text-foreground' : 'text-primary-foreground'}`}
                    >
                      {isGuest ? 'Follow' : isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })()}
            <TouchableOpacity
              onPress={handleShare}
              activeOpacity={0.7}
              className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border"
            >
              <Share2 size={15} color={Theme.colors.foreground} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
