import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { pickLibraryImages } from '~/shared/lib/media/photos/imagePickerLaunch';
import { uploadLocalPickerImage } from '~/shared/lib/media/photos/storageUpload';
import { toastError } from '~/shared/lib/appToast';

export type UseRexPhotoUploadGridParams = {
  bucket: string;
  userId: string | undefined;
  maxPhotos: number;
  photos: string[];
  onChange: (paths: string[]) => void;
};

export function useRexPhotoUploadGrid({
  bucket,
  userId,
  maxPhotos,
  photos,
  onChange,
}: UseRexPhotoUploadGridParams) {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const pickAndUpload = useCallback(async () => {
    if (!userId) return;
    setError(null);

    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) return;

    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        toastError('Photos', 'Please allow photo library access to add images.');
        return;
      }
    }

    const assets = await pickLibraryImages(remaining);

    if (!assets.length) return;
    setUploading(assets.length);
    const newPaths: string[] = [];

    for (const asset of assets) {
      try {
        const name = asset.fileName ?? `photo-${Date.now()}.jpg`;
        const path = await uploadLocalPickerImage(bucket, userId, asset.uri, name, asset.mimeType);
        newPaths.push(path);
      } catch (e) {
        const err = e as Error;
        setError(err.message || 'Upload failed');
      } finally {
        asset.dispose?.();
        setUploading((n) => Math.max(0, n - 1));
      }
    }

    if (newPaths.length > 0) {
      onChange([...photos, ...newPaths]);
    }
  }, [userId, maxPhotos, photos, onChange, bucket]);

  const removeAt = useCallback(
    (index: number) => {
      onChange(photos.filter((_, i) => i !== index));
    },
    [photos, onChange],
  );

  const canAdd = photos.length < maxPhotos && uploading === 0;

  return {
    pickAndUpload,
    uploading,
    error,
    clearError,
    removeAt,
    canAdd,
  };
}
