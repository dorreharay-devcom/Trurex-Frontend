import { useCallback, useState } from 'react';
import { ProfileApi } from '~/features/profile/api/profileApi';
import { pickSingleLibraryImage } from '~/shared/lib/media/photos/pickSingleLibraryImage';
import { photoUploadErrorMessage } from '~/shared/lib/media/photos/storageUpload';
import { toastError } from '~/shared/lib/appToast';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';

type Params = {
  userId?: string | null;
  onUploaded: () => void | Promise<void>;
  onAvatarUpdated?: () => void;
};

export function useProfileAvatarUpload({ userId, onUploaded, onAvatarUpdated }: Params) {
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleAvatarPress = useCallback(async () => {
    if (!userId) return;
    if (!assertOnlineForMutation('Uploading photo')) return;

    try {
      const asset = await pickSingleLibraryImage('Allow photo access to change your avatar.');
      if (!asset) return;

      try {
        setAvatarUploading(true);
        await ProfileApi.uploadAvatar(
          userId,
          asset.uri,
          asset.fileName ?? `avatar-${Date.now()}.jpg`,
          asset.mimeType,
        );
        await onUploaded();
        onAvatarUpdated?.();
      } finally {
        asset.dispose?.();
        setAvatarUploading(false);
      }
    } catch (e) {
      toastError('Photo unavailable', photoUploadErrorMessage(e));
    }
  }, [userId, onUploaded, onAvatarUpdated]);

  return { avatarUploading, handleAvatarPress };
}
