import { useState } from 'react';
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
import { isOfflineMutationBlocked, withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { invalidateBusinessAccount } from '~/shared/lib/query/invalidateBusinessAccount';

type Params = {
  initial: BusinessProfile;
  onClose: () => void;
};

export function useEditBusinessProfileForm({ initial, onClose }: Params) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState(initial.description ?? '');
  const [addressWarningOpen, setAddressWarningOpen] = useState(false);
  const changes = { initialDescription: initial.description, description };

  const save = useMutation({
    mutationFn: withOnlineMutation<void, void>('Saving your business profile', async () => {
      const input = toUpdateBusinessProfileInput(changes);
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

  return {
    description,
    setDescription,
    saving: save.isPending,
    canSave: hasBusinessProfileChanges(changes) && !save.isPending,
    save: () => save.mutate(),
    addressWarningOpen,
    openAddressWarning: () => setAddressWarningOpen(true),
    closeAddressWarning: () => setAddressWarningOpen(false),
  };
}
