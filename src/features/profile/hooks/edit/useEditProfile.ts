import { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';
import { useAuth } from '~/features/auth/providers';
import { useDeleteAccount } from '~/features/profile/hooks/edit/useDeleteAccount';
import { useEditProfileAvatar } from '~/features/profile/hooks/edit/useEditProfileAvatar';
import { useEditProfileForm } from '~/features/profile/hooks/edit/useEditProfileForm';
import { toUpdateProfileInput } from '~/features/profile/lib/editProfilePayload';
import { useBlockedUsers } from '~/features/profile/hooks/useBlockUser';
import { ProfileApi } from '~/features/profile/api/profileApi';
import { isWeb } from '~/shared/lib/ui/platform';
import { toastError } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { photoUploadErrorMessage } from '~/shared/lib/media/photos/storageUpload';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';

type Params = {
  onClose: () => void;
};

export function useEditProfile({ onClose }: Params) {
  const { user, signOut } = useAuth();
  const { data: blockedUsers } = useBlockedUsers(user?.id);
  const [saving, setSaving] = useState(false);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);

  const fields = useEditProfileForm({ userId: user?.id });
  const avatar = useEditProfileAvatar({
    userId: user?.id,
    setCurrentAvatarUrl: fields.setCurrentAvatarUrl,
  });
  const { persist: persistAvatar } = avatar;
  const deleteAccount = useDeleteAccount({
    signOut,
    onDeleted: onClose,
  });

  const save = useCallback(async () => {
    if (!user) return;
    if (!assertOnlineForMutation('Saving profile')) return;
    if (!isWeb) Keyboard.dismiss();

    setSaving(true);
    try {
      await persistAvatar();
      await ProfileApi.update(
        user.id,
        toUpdateProfileInput({
          displayName: fields.displayName,
          handle: fields.handle,
          bio: fields.bio,
          location: fields.location,
          currently: fields.currently,
        }),
      );
      onClose();
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Failed to save profile', photoUploadErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }, [
    user,
    persistAvatar,
    fields.displayName,
    fields.handle,
    fields.bio,
    fields.location,
    fields.currently,
    onClose,
  ]);

  return {
    loading: fields.loading,
    saving,
    blocked: {
      show: showBlockedUsers,
      open: () => setShowBlockedUsers(true),
      close: () => setShowBlockedUsers(false),
      count: blockedUsers?.length,
    },
    fields: {
      displayName: fields.displayName,
      setDisplayName: fields.setDisplayName,
      handle: fields.handle,
      setHandle: fields.setHandle,
      bio: fields.bio,
      setBio: fields.setBio,
      location: fields.location,
      setLocation: fields.setLocation,
      currently: fields.currently,
      setCurrentlyField: fields.setCurrentlyField,
    },
    avatar: {
      uploading: avatar.uploading,
      currentUrl: fields.currentAvatarUrl,
      pending: avatar.pendingAvatar,
      pick: avatar.pick,
      clear: avatar.clear,
    },
    account: {
      confirmVisible: deleteAccount.confirmVisible,
      pending: deleteAccount.pending,
      openConfirm: deleteAccount.openConfirm,
      closeConfirm: deleteAccount.closeConfirm,
      confirm: deleteAccount.confirm,
    },
    save,
  };
}
