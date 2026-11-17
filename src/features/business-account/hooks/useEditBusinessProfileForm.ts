import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BusinessAccountApi } from '~/features/business-account/api/businessAccountApi';
import {
  hasBusinessProfileChanges,
  toUpdateBusinessProfileInput,
} from '~/features/business-account/lib/businessProfileForm';
import { businessProfileUpdateErrorMessage } from '~/features/business-account/lib/claimErrors';
import type { BusinessProfile } from '~/features/business-account/types/businessProfile';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import type { PickedLibraryImage } from '~/shared/lib/media/photos/imagePickerLaunch';
import { pickSingleLibraryImage } from '~/shared/lib/media/photos/pickSingleLibraryImage';
import { photoUploadErrorMessage } from '~/shared/lib/media/photos/storageUpload';
import { isOfflineMutationBlocked, withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { invalidateBusinessAccount } from '~/shared/lib/query/invalidateBusinessAccount';

type Params = {
  userId: string;
  initial: BusinessProfile;
  onClose: () => void;
};

export function useEditBusinessProfileForm({ userId, initial, onClose }: Params) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState(initial.description ?? '');
  const [pendingPhoto, setPendingPhoto] = useState<PickedLibraryImage | null>(null);
  const [picking, setPicking] = useState(false);
  const [addressWarningOpen, setAddressWarningOpen] = useState(false);

  useEffect(() => () => pendingPhoto?.dispose?.(), [pendingPhoto]);

  const pickPhoto = useCallback(async () => {
    setPicking(true);
    try {
      const asset = await pickSingleLibraryImage(
        'Allow photo access to change your business photo.',
      );
      if (asset) setPendingPhoto(asset);
    } catch (e) {
      toastError('Photo unavailable', photoUploadErrorMessage(e));
    } finally {
      setPicking(false);
    }
  }, []);

  const save = useMutation({
    mutationFn: withOnlineMutation<void, void>('Saving your business profile', async () => {
      const photoPath = pendingPhoto
        ? await BusinessAccountApi.uploadPhoto(userId, pendingPhoto)
        : null;
      const input = toUpdateBusinessProfileInput({
        initialDescription: initial.description,
        description,
        photoPath,
      });
      if (input) await BusinessAccountApi.updateProfile(input);
    }),
    onSuccess: () => {
      invalidateBusinessAccount(queryClient);
      toastSuccess('Business profile updated');
      onClose();
    },
    onError: (error) => {
      if (isOfflineMutationBlocked(error) || didAccountFrozenMutationToast(error)) return;
      toastError("Couldn't save changes", businessProfileUpdateErrorMessage(error));
    },
  });

  const hasChanges = hasBusinessProfileChanges({
    initialDescription: initial.description,
    description,
    hasPendingPhoto: pendingPhoto != null,
  });

  return {
    description,
    setDescription,
    pendingPhoto,
    currentPhotoPath: initial.photoPath,
    picking,
    pickPhoto: () => void pickPhoto(),
    saving: save.isPending,
    canSave: hasChanges && !save.isPending && !picking,
    save: () => save.mutate(),
    addressWarningOpen,
    openAddressWarning: () => setAddressWarningOpen(true),
    closeAddressWarning: () => setAddressWarningOpen(false),
  };
}
