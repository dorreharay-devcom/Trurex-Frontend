import type { Href } from 'expo-router';
import { Routes } from '~/shared/config/routes';
import { resolvePostAuthRoute } from '~/features/auth/lib/postAuthRoute';
import { checkMfaRequirement } from './mfa';

type NavigateAfterAuthenticatedSessionParams = {
  setMfaPending: (pending: boolean) => Promise<void>;
  setMfaChecking: (checking: boolean) => void;
  onRedirect: (href: Href) => void;
  onReady: () => void;
};

export async function navigateAfterAuthenticatedSession(
  params: NavigateAfterAuthenticatedSessionParams,
): Promise<void> {
  const mfa = await checkMfaRequirement();
  if (mfa.required) {
    await params.setMfaPending(true);
    params.setMfaChecking(false);
    params.onRedirect(Routes.Mfa);
    return;
  }

  await params.setMfaPending(false);

  const route = await resolvePostAuthRoute();
  if (route) {
    params.setMfaChecking(false);
    params.onRedirect(route);
    return;
  }

  params.onReady();
}
