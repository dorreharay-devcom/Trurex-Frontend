import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { ACCOUNT_MODE } from '~/features/business-account/config/accountMode';
import {
  ensureAccountMode,
  fetchFreshMyProfiles,
} from '~/features/business-account/lib/accountModeSwitch';
import { Routes } from '~/shared/config/routes';

export function useOpenMyBusinessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  return useCallback(async () => {
    if (userId) {
      const profiles = await fetchFreshMyProfiles(queryClient, userId).catch(() => []);
      ensureAccountMode(queryClient, userId, profiles, ACCOUNT_MODE.business);
    }
    router.push(Routes.MyBusinessPage);
  }, [queryClient, router, userId]);
}
