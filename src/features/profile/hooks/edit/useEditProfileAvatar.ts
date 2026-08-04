import { useCallback, useEffect, useState } from 'react';
import type { PendingAvatar } from '~/features/profile/types/profile';
import { ProfileApi } from '~/features/profile/api/profileApi';
import { pickAvatarAsset } from '~/features/profile/lib/pickAvatarAsset';
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
      const asset = await pickAvatarAsset('Please allow access to your photo library.');
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
      const publicUrl = await ProfileApi.uploadAvatar(
        userId,
        pendingAvatar.uri,
        pendingAvatar.fileName ?? `avatar-${Date.now()}.jpg`,
        pendingAvatar.mimeType,
      );
      pendingAvatar.dispose?.();
      setCurrentAvatarUrl(publicUrl);
      setPendingAvatar(null);
      setAvatarRemoved(false);
      return;
    }

    if (!avatarRemoved) return;

    await ProfileApi.updateAvatar('');
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
