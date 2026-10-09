import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '~/features/auth/providers/AuthProvider';
import { Routes } from '~/shared/config/routes';
import { TAB } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';
import { createIdentityVerificationSession } from '~/features/identity-verification/lib/identityVerificationApi';
import { writeStoredIdentityVerificationPrompted } from '~/features/identity-verification/lib/identityVerificationPromptStorage';
import { unknownErrorMessage } from '~/shared/lib/data/guards';

type Pending = 'idle' | 'verify' | 'skip';

export function useIdentityVerificationPrompt() {
  const router = useRouter();
  const { session } = useAuth();

  const [pending, setPending] = useState<Pending>('idle');
  const [error, setError] = useState<string>();

  const redirectTo = !session ? Routes.Login : null;

  async function proceedToApp() {
    await writeStoredIdentityVerificationPrompted();
    openMainTab(router, TAB.discover);
  }

  async function handleVerifyNow() {
    setPending('verify');
    setError(undefined);
    try {
      const url = await createIdentityVerificationSession();
      await WebBrowser.openAuthSessionAsync(url);
      await proceedToApp();
    } catch (err) {
      setError(unknownErrorMessage(err, 'Could not start verification. Please try again.'));
      setPending('idle');
    }
  }

  async function handleSkip() {
    setPending('skip');
    await proceedToApp();
  }

  return {
    redirectTo,
    verifying: pending === 'verify',
    skipping: pending === 'skip',
    busy: pending !== 'idle',
    error,
    handleVerifyNow,
    handleSkip,
  };
}
