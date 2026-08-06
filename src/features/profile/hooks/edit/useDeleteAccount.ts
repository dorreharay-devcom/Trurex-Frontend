import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthApi } from '~/shared/api/authApi';
import { Routes } from '~/shared/config/routes';
import { toastError } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';

type Params = {
  signOut: () => Promise<unknown>;
  onDeleted: () => void;
};

export function useDeleteAccount({ signOut, onDeleted }: Params) {
  const router = useRouter();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pending, setPending] = useState(false);

  const openConfirm = useCallback(() => setConfirmVisible(true), []);

  const closeConfirm = useCallback(() => {
    if (pending) return;
    setConfirmVisible(false);
  }, [pending]);

  const confirm = useCallback(async () => {
    if (!assertOnlineForMutation('Deleting account')) return;
    setPending(true);
    try {
      await AuthApi.deleteAccount();
      try {
        await signOut();
      } catch {
        await AuthApi.signOut().catch(() => {});
      }
      setConfirmVisible(false);
      onDeleted();
      router.replace(Routes.Signup);
    } catch (e) {
      toastError('Could not delete account', unknownErrorMessage(e, 'Please try again.'));
    } finally {
      setPending(false);
    }
  }, [signOut, onDeleted, router]);

  return {
    confirmVisible,
    pending,
    openConfirm,
    closeConfirm,
    confirm,
  };
}
