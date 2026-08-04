import { checkMfaRequirement } from './mfa';

type NavigateAfterAuthenticatedSessionParams = {
  setMfaPending: (pending: boolean) => Promise<void>;
  setMfaChecking: (checking: boolean) => void;
  onRequireMfa: () => void;
  onReady: () => void;
};

export async function navigateAfterAuthenticatedSession(
  params: NavigateAfterAuthenticatedSessionParams,
): Promise<void> {
  const mfa = await checkMfaRequirement();
  if (mfa.required) {
    await params.setMfaPending(true);
    params.setMfaChecking(false);
    params.onRequireMfa();
    return;
  }

  await params.setMfaPending(false);
  params.onReady();
}
