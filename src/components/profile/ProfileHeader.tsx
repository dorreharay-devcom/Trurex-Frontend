import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, Camera } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { USER_AVATARS_BUCKET } from '~/constants/storageBuckets';
import type { ProfileData } from '~/types/profile';

export type { ProfileData };

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onSignOut?: () => void;
  onAvatarPress?: () => void;
  avatarUploading?: boolean;
}

const ProfileHeader = ({
  profile,
  isOwnProfile = false,
  onEditProfile,
  onSignOut,
  onAvatarPress,
  avatarUploading = false,
}: ProfileHeaderProps) => {
  return (
    <View className="overflow-hidden rounded-t-xl">
      <LinearGradient
        colors={[Theme.colors.secondary, Theme.colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 112 }}
      />

      <View className="px-4 -mt-12">
        <View className="self-start">
          <TouchableOpacity
            onPress={isOwnProfile ? onAvatarPress : undefined}
            activeOpacity={isOwnProfile ? 0.8 : 1}
            disabled={avatarUploading}
          >
            <View className="w-24 h-24 rounded-2xl bg-muted overflow-hidden border-4 border-card">
              {profile.avatarUrl ? (
                <SignedStorageImage
                  bucket={USER_AVATARS_BUCKET}
                  storagePath={profile.avatarUrl}
                  className="w-full h-full"
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-3xl font-bold text-muted">
                    {profile.displayName?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              {isOwnProfile && (
                <View
                  className="absolute bottom-0 left-0 right-0 items-center justify-center py-1.5"
                  style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
                >
                  <Camera size={14} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary items-center justify-center">
            <Text className="text-[10px] font-bold text-primary-foreground">
              {profile.trustScore}
            </Text>
          </View>
        </View>

        <View className="mt-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-bold text-foreground">{profile.displayName}</Text>
            {profile.relationshipStatus && (
              <View className="px-2 py-0.5 rounded-full bg-secondary">
                <Text className="text-[10px] font-bold text-secondary-foreground uppercase">
                  {profile.relationshipStatus.replace('_', ' ')}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-muted-foreground">{profile.handle}</Text>
          {!!profile.bio && (
            <Text className="text-sm text-foreground/80 mt-2 leading-relaxed">{profile.bio}</Text>
          )}
          {!!profile.location && (
            <Text className="text-xs text-muted-foreground mt-1.5">📍 {profile.location}</Text>
          )}
        </View>

        <View className="flex-row gap-6 mt-4 pb-4 border-b border-border">
          <View className="items-center">
            <Text className="text-lg font-bold text-foreground text-center">
              {profile.rexCount}
            </Text>
            <Text className="text-xs text-muted-foreground text-center">Rex's</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-foreground text-center">
              {profile.followers}
            </Text>
            <Text className="text-xs text-muted-foreground text-center">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-foreground text-center">
              {profile.following}
            </Text>
            <Text className="text-xs text-muted-foreground text-center">Following</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-accent-foreground text-center">
              {profile.trustScore}
            </Text>
            <Text className="text-xs text-muted-foreground text-center">Trust</Text>
          </View>
        </View>

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
              onPress={onSignOut}
              activeOpacity={0.7}
              className="py-2.5 px-3 rounded-lg border border-border items-center justify-center"
            >
              <LogOut size={16} color={Theme.colors.muted} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-full mt-4 mb-2 py-2.5 rounded-lg bg-primary items-center"
          >
            <Text className="text-sm font-bold text-primary-foreground">Trust This Rex</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
