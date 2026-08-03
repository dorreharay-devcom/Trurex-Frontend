import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { Camera, X } from 'lucide-react-native';
import type { PendingAvatar } from '~/features/profile/types/profile';
import { USER_AVATARS_BUCKET } from '~/shared/config/app';
import { Theme } from '~/shared/theme/Theme';
import { SignedStorageImage } from '~/shared/ui/SignedStorageImage';

type Props = {
  displayName: string;
  pendingAvatar: PendingAvatar | null;
  currentAvatarUrl: string | null;
  uploading: boolean;
  onPick: () => void;
  onClear: () => void;
};

const EditProfileAvatar = ({
  displayName,
  pendingAvatar,
  currentAvatarUrl,
  uploading,
  onPick,
  onClear,
}: Props) => {
  const showClear = Boolean(pendingAvatar || currentAvatarUrl) && !uploading;
  const showOverlay = uploading || (!pendingAvatar && !currentAvatarUrl);
  const initial = displayName.charAt(0).toUpperCase() || '?';

  let media: React.ReactNode;
  if (pendingAvatar) {
    media = (
      <Image source={{ uri: pendingAvatar.uri }} className="h-full w-full" resizeMode="cover" />
    );
  } else if (currentAvatarUrl) {
    media = (
      <SignedStorageImage
        bucket={USER_AVATARS_BUCKET}
        storagePath={currentAvatarUrl}
        remoteUri={currentAvatarUrl}
        className="h-full w-full"
      />
    );
  } else {
    media = (
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-muted-foreground">{initial}</Text>
      </View>
    );
  }

  return (
    <View className="items-center gap-3">
      <View className="relative">
        <TouchableOpacity onPress={onPick} activeOpacity={0.85} className="relative">
          <View className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-border bg-muted">
            {media}
          </View>
          {showOverlay && (
            <View className="absolute inset-0 items-center justify-center rounded-2xl bg-muted/50">
              {uploading ? (
                <ActivityIndicator color={Theme.colors.card} size="small" />
              ) : (
                <Camera size={24} color={Theme.colors.card} />
              )}
            </View>
          )}
        </TouchableOpacity>
        {showClear && (
          <TouchableOpacity
            onPress={onClear}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Remove photo"
            className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-card"
          >
            <X size={14} color={Theme.colors.foreground} />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-xs text-muted-foreground">Tap to change photo</Text>
    </View>
  );
};

export default EditProfileAvatar;
