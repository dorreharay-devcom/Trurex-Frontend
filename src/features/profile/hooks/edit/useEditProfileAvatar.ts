import { useCallback, useEffect, useState } from 'react';
import type { PendingAvatar } from '~/features/profile/types/profile';
import { ProfileApi } from '~/features/profile/api/profileApi';
import { pickSingleLibraryImage } from '~/shared/lib/media/photos/pickSingleLibraryImage';
import { toastError } from '~/shared/lib/appToast';
import { photoUploadErrorMessage } from '~/shared/lib/media/photos/storageUpload';

type Params = {
  userId?: string | null;
  setCurrentAvatarUrl: (url: string | null) => void;
};

export function useEditProfileAvatar({ userId, setCurrentAvatarUrl }: Params) {
  const [uploading, setUploading] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  useEffect(() => () => pendingAvatar?.dispose?.(), [pendingAvatar]);

  const pick = useCallback(async () => {
    if (!userId) return;

    setUploading(true);
    try {
      const asset = await pickSingleLibraryImage('Please allow access to your photo library.');
      if (!asset) return;

      setPendingAvatar((prev) => {
        prev?.dispose?.();
        return {
          uri: asset.uri,
          fileName: asset.fileName,
          mimeType: asset.mimeType,
          dispose: asset.dispose,
        };
      });
      setAvatarRemoved(false);
    } catch (e) {
      toastError('Photo unavailable', photoUploadErrorMessage(e));
    } finally {
      setUploading(false);
    }
  }, [userId]);

  const clear = useCallback(() => {
    setPendingAvatar((prev) => {
      prev?.dispose?.();
      return null;
    });
    setCurrentAvatarUrl(null);
    setAvatarRemoved(true);
  }, [setCurrentAvatarUrl]);

  const persist = useCallback(async () => {
    if (!userId) return;

    if (pendingAvatar) {
      const avatarPath = await ProfileApi.uploadAvatar({
        loginId: userId,
        imageUri: pendingAvatar.uri,
        fileName: pendingAvatar.fileName ?? `avatar-${Date.now()}.jpg`,
        mimeType: pendingAvatar.mimeType,
      });
      pendingAvatar.dispose?.();
      setCurrentAvatarUrl(avatarPath);
      setPendingAvatar(null);
      setAvatarRemoved(false);
      return;
    }

    if (!avatarRemoved) return;

    await ProfileApi.updateAvatar(null);
    setCurrentAvatarUrl(null);
    setAvatarRemoved(false);
  }, [userId, pendingAvatar, avatarRemoved, setCurrentAvatarUrl]);

  return {
    uploading,
    pendingAvatar,
    pick,
    clear,
    persist,
  };
}
