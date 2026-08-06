import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '~/features/auth/providers';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { toastError } from '~/shared/lib/appToast';
import { generateRexImageStoragePath } from '~/shared/lib/media/photos/photoUtils';
import {
  preparePickerImageForUpload,
  uploadBlobToStorageBucket,
} from '~/shared/lib/media/photos/storageUpload';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';

const COVER_MAX_DIMENSION = 800;

export function useCoverImagePicker() {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pick = useCallback(async () => {
    if (!user) return;
    if (!assertOnlineForMutation('Uploading cover')) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      toastError('Photos', 'Please allow photo library access to add a cover image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setPreview(asset.uri);
    setUploading(true);
    try {
      const fileName = asset.fileName ?? `cover-${Date.now()}.jpg`;
      const prepared = await preparePickerImageForUpload(
        asset.uri,
        fileName,
        asset.mimeType,
        COVER_MAX_DIMENSION,
      );
      const path = generateRexImageStoragePath(user.id, prepared.fileName ?? fileName);
      await uploadBlobToStorageBucket(REX_IMAGES_BUCKET, path, prepared.body, prepared.contentType);
      setStoragePath(path);
    } catch (e: unknown) {
      toastError('Upload failed', e instanceof Error ? e.message : 'Could not upload cover image.');
      setPreview(null);
      setStoragePath(null);
    } finally {
      setUploading(false);
    }
  }, [user]);

  const clear = useCallback(() => {
    setPreview(null);
    setStoragePath(null);
  }, []);

  return { preview, storagePath, uploading, pick, clear };
}

export type CoverImagePickerState = ReturnType<typeof useCoverImagePicker>;
