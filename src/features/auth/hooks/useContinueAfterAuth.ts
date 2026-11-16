import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '~/features/auth/providers/AuthProvider';
import { resolvePostAuthRoute } from '~/features/auth/lib/postAuthRoute';
import { TAB } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';

export function useContinueAfterAuth() {
  const router = useRouter();
  const { setMfaPending, setMfaChecking } = useAuth();

  return useCallback(async () => {
    const route = await resolvePostAuthRoute();
    await setMfaPending(false);
    if (route) {
      router.replace(route);
      return;
    }
    setMfaChecking(true);
    openMainTab(router, TAB.discover);
  }, [router, setMfaChecking, setMfaPending]);
}
