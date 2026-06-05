import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Plus, X, CircleAlert } from 'lucide-react-native';
import { useAuth } from '~/services/AuthContext';
import { useRexPhotoUploadGrid } from '~/hooks/useRexPhotoUploadGrid';
import { SignedRexThumb } from './SignedRexThumb';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';

export const REX_IMAGES_DEFAULT_BUCKET = REX_IMAGES_BUCKET;

export const PHOTO_UPLOAD_THUMB_PX = 72;

export type PhotoUploadGridProps = {
  bucket?: string;
  maxPhotos?: number;
  photos: string[];
  onChange: (paths: string[]) => void;
};

export function PhotoUploadGrid({
  bucket = REX_IMAGES_DEFAULT_BUCKET,
  maxPhotos = 5,
  photos,
  onChange,
}: PhotoUploadGridProps) {
  const { user } = useAuth();
  const { pickAndUpload, uploading, error, clearError, removeAt, canAdd } = useRexPhotoUploadGrid({
    bucket,
    userId: user?.id,
    maxPhotos,
    photos,
    onChange,
  });

  const thumb = PHOTO_UPLOAD_THUMB_PX;

  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap gap-2">
        {photos.map((path, i) => (
          <View
            key={path}
            style={{ width: thumb, height: thumb }}
            className="relative overflow-hidden rounded-xl border border-border bg-muted"
          >
            <SignedRexThumb bucket={bucket} path={path} size={thumb} />
            <Pressable
              onPress={() => removeAt(i)}
              className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-foreground/70"
              accessibilityLabel={`Remove photo ${i + 1}`}
            >
              <X size={12} color={Theme.colors.white} />
            </Pressable>
          </View>
        ))}

        {uploading > 0 &&
          Array.from({ length: uploading }).map((_, i) => (
            <View
              key={`u-${i}`}
              style={{ width: thumb, height: thumb }}
              className="items-center justify-center rounded-xl border border-border bg-muted"
            >
              <ActivityIndicator color={Theme.colors.primary} />
            </View>
          ))}

        {canAdd ? (
          <Pressable
            onPress={pickAndUpload}
            style={{ width: thumb, height: thumb }}
            className="items-center justify-center rounded-xl border-2 border-dashed border-border active:border-primary/40"
            accessibilityLabel="Add photo"
          >
            <Plus size={20} color={Theme.colors.secondaryText} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View className="flex-row flex-wrap items-center gap-1">
          <CircleAlert size={14} color={Theme.colors.destructive} />
          <Text className="flex-1 text-xs text-destructive">{error}</Text>
          <Pressable onPress={clearError}>
            <Text className="text-xs text-destructive underline">Dismiss</Text>
          </Pressable>
        </View>
      ) : null}

      <Text className={cn('text-[10px] text-muted-foreground')}>
        {photos.length}/{maxPhotos} photos
      </Text>
    </View>
  );
}
