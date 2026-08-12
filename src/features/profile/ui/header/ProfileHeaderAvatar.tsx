import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { USER_AVATARS_BUCKET } from '~/shared/config/app';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { avatarImageTransform } from '~/shared/lib/media/imageTransform';

const PROFILE_AVATAR_TRANSFORM = avatarImageTransform(96);

type Props = {
  displayName: string;
  avatarUrl?: string | null;
  editable: boolean;
  disabled: boolean;
  avatarRefreshKey?: number;
  onPress?: () => void;
};

const ProfileHeaderAvatar = ({
  displayName,
  avatarUrl,
  editable,
  disabled,
  avatarRefreshKey,
  onPress,
}: Props) => {
  const initial = displayName.charAt(0).toUpperCase() || '?';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={editable ? 0.8 : 1}
      disabled={disabled}
      accessibilityRole={editable ? 'button' : undefined}
      accessibilityLabel={editable ? 'Change profile photo' : undefined}
    >
      <View className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-border bg-muted">
        {avatarUrl ? (
          <SignedStorageImage
            bucket={USER_AVATARS_BUCKET}
            storagePath={avatarUrl}
            className="absolute inset-0"
            cacheVersion={avatarRefreshKey}
            imageTransform={PROFILE_AVATAR_TRANSFORM}
            recyclingKey={`${avatarUrl}:${avatarRefreshKey ?? 0}`}
            priority="low"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-3xl font-bold text-muted">{initial}</Text>
          </View>
        )}
        {editable && (
          <View className="absolute bottom-0 left-0 right-0 items-center justify-center bg-black/45 py-1.5">
            <Camera size={14} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProfileHeaderAvatar;
