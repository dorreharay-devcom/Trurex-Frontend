import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { USER_AVATARS_BUCKET } from '~/shared/config/app';
import { Theme } from '~/shared/theme/Theme';
import type { PickedLibraryImage } from '~/shared/lib/media/photos/imagePickerLaunch';
import { avatarImageTransform } from '~/shared/lib/media/imageTransform';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';

const EDIT_PHOTO_TRANSFORM = avatarImageTransform(112);

type Props = {
  pendingPhoto: PickedLibraryImage | null;
  currentPhotoPath: string | null;
  busy: boolean;
  onPick: () => void;
};

function PhotoMedia({ pendingPhoto, currentPhotoPath }: Omit<Props, 'busy' | 'onPick'>) {
  if (pendingPhoto) {
    return (
      <Image source={{ uri: pendingPhoto.uri }} className="h-full w-full" resizeMode="cover" />
    );
  }
  if (currentPhotoPath) {
    return (
      <SignedStorageImage
        bucket={USER_AVATARS_BUCKET}
        storagePath={currentPhotoPath}
        className="absolute inset-0"
        imageTransform={EDIT_PHOTO_TRANSFORM}
        recyclingKey={currentPhotoPath}
        priority="low"
      />
    );
  }
  return null;
}

function EditBusinessPhoto({ pendingPhoto, currentPhotoPath, busy, onPick }: Props) {
  const showOverlay = busy || (!pendingPhoto && !currentPhotoPath);

  return (
    <View className="items-center gap-3">
      <TouchableOpacity
        onPress={onPick}
        disabled={busy}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Change business photo"
      >
        <View className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-border bg-muted">
          <PhotoMedia pendingPhoto={pendingPhoto} currentPhotoPath={currentPhotoPath} />
        </View>
        {showOverlay ? (
          <View className="absolute inset-0 items-center justify-center rounded-2xl bg-muted/50">
            {busy ? (
              <ActivityIndicator color={Theme.colors.card} size="small" />
            ) : (
              <Camera size={24} color={Theme.colors.card} />
            )}
          </View>
        ) : null}
      </TouchableOpacity>
      <Text className="text-xs text-muted-foreground">Tap to change business photo</Text>
    </View>
  );
}

export default EditBusinessPhoto;
