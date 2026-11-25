import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { BusinessAccountApi } from '~/features/business-account/api/businessAccountApi';
import { ACCOUNT_MODE } from '~/features/business-account/config/accountMode';
import { switchAccountMode } from '~/features/business-account/lib/accountModeSwitch';
import { businessProfileDeleteErrorMessage } from '~/features/business-account/lib/claimErrors';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';
import { invalidateBusinessAccount } from '~/shared/lib/query/invalidateBusinessAccount';

type Params = {
  onDeleted: () => void;
};

export function useDeleteBusinessProfile({ onDeleted }: Params) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pending, setPending] = useState(false);

  const openConfirm = useCallback(() => setConfirmVisible(true), []);

  const closeConfirm = useCallback(() => {
    if (pending) return;
    setConfirmVisible(false);
  }, [pending]);

  const confirm = useCallback(async () => {
    if (!userId || !assertOnlineForMutation('Deleting business profile')) return;
    setPending(true);
    try {
      await BusinessAccountApi.deleteBusinessProfile();
      switchAccountMode(queryClient, userId, ACCOUNT_MODE.personal);
      invalidateBusinessAccount(queryClient);
      setConfirmVisible(false);
      onDeleted();
      toastSuccess('Business profile deleted');
    } catch (e) {
      toastError('Could not delete business profile', businessProfileDeleteErrorMessage(e));
    } finally {
      setPending(false);
    }
  }, [userId, queryClient, onDeleted]);

  return { confirmVisible, pending, openConfirm, closeConfirm, confirm };
}
