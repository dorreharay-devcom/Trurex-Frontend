import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '~/features/auth/providers/AuthProvider';
import { Routes } from '~/shared/config/routes';
import { TAB } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';
import { attemptBiometricUnlock } from '~/features/auth/lib/biometrics';
import { markIdentityVerified } from '~/features/identity-verification/lib/identityVerificationApi';
import { writeStoredIdentityVerificationPrompted } from '~/features/identity-verification/lib/identityVerificationPromptStorage';
import { unknownErrorMessage } from '~/shared/lib/data/guards';

type Pending = 'idle' | 'verify' | 'skip';

export function useIdentityVerificationPrompt() {
  const router = useRouter();
  const { session } = useAuth();
  const canGoBack = router.canGoBack();

  const [pending, setPending] = useState<Pending>('idle');
  const [error, setError] = useState<string>();

  const redirectTo = !session ? Routes.Login : null;

  async function proceedToApp() {
    await writeStoredIdentityVerificationPrompted();
    if (canGoBack) {
      router.back();
      return;
    }
    openMainTab(router, TAB.discover);
  }

  async function handleVerifyNow() {
    setPending('verify');
    setError(undefined);
    try {
      const result = await attemptBiometricUnlock();
      if (result === 'not_applicable') {
        setError('Face ID or Touch ID isn’t set up on this device.');
        setPending('idle');
        return;
      }
      if (result === 'failed') {
        setError('Could not confirm it’s you. Please try again.');
        setPending('idle');
        return;
      }
      await markIdentityVerified();
      await proceedToApp();
    } catch (err) {
      setError(unknownErrorMessage(err, 'Could not complete verification. Please try again.'));
      setPending('idle');
    }
  }

  async function handleSkip() {
    setPending('skip');
    await proceedToApp();
  }

  function handleBack() {
    router.back();
  }

  return {
    redirectTo,
    showSkip: !canGoBack,
    showBack: canGoBack,
    verifying: pending === 'verify',
    skipping: pending === 'skip',
    busy: pending !== 'idle',
    error,
    handleVerifyNow,
    handleSkip,
    handleBack,
  };
}
