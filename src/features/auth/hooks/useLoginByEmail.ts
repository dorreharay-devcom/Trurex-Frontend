import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthApi } from '~/shared/api/auth';
import { useAuth } from '~/features/auth/providers/AuthProvider';
import { Routes } from '~/shared/config/routes';
import {
  getEmailValidationError,
  getPasswordValidationError,
  isFieldErrorsEmpty,
} from '~/features/auth/lib/credentials';
import { mapAuthError } from '~/features/auth/lib/errors';
import { navigateAfterAuthenticatedSession } from '~/features/auth/lib/mfa';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { toastError } from '~/shared/lib/appToast';
import { useAuthInviteCode } from '~/features/auth/hooks/useAuthInviteCode';
import type { OAuthProvider } from '~/features/auth/lib/oauth';
import { useOAuthSignIn } from '~/features/auth/hooks/useOAuthSignIn';

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export function useLoginByEmail() {
  const router = useRouter();
  const { setMfaPending, setMfaChecking } = useAuth();
  const { signInWithOAuth, oauthPending } = useOAuthSignIn();
  const invite = useAuthInviteCode();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  function validateForm(): boolean {
    const fieldErrors = {
      email: getEmailValidationError(email),
      password: getPasswordValidationError(password),
    };
    setErrors(fieldErrors);
    return isFieldErrorsEmpty(fieldErrors) && invite.validate();
  }

  async function resetMfaGate() {
    await setMfaPending(false);
    setMfaChecking(false);
  }

  async function failAfterSignIn(error: unknown) {
    await AuthApi.signOut().catch(() => {});
    setErrors({
      general: unknownErrorMessage(
        error,
        'Could not send your verification code. Please try again.',
      ),
    });
  }

  function failCredentials(error: unknown) {
    toastError(unknownErrorMessage(error, 'Sign in failed'));
    mapAuthError(error, setErrors);
  }

  async function handleLogin() {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    let signedIn = false;

    try {
      setMfaChecking(true);
      await AuthApi.signIn({ email, password });
      signedIn = true;

      await navigateAfterAuthenticatedSession({
        setMfaPending,
        setMfaChecking,
        onRequireMfa: () => router.replace(Routes.Mfa),
        onReady: () => router.replace(Routes.Main),
      });
    } catch (error: unknown) {
      await resetMfaGate();
      if (signedIn) {
        await failAfterSignIn(error);
      } else {
        failCredentials(error);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleOAuthLogin(provider: OAuthProvider) {
    if (!invite.validate()) return;
    signInWithOAuth(provider);
  }

  return {
    invite,
    email,
    password,
    errors,
    loading,
    oauthPending,
    busy: oauthPending || loading,
    onEmailChange: (value: string) => {
      setEmail(value);
      setErrors((e) => ({ ...e, email: undefined, general: undefined }));
    },
    onPasswordChange: (value: string) => {
      setPassword(value);
      setErrors((e) => ({ ...e, password: undefined, general: undefined }));
    },
    handleOAuthLogin,
    handleLogin,
    goToForgotPassword: () => router.push(Routes.ForgotPassword),
    goToSignup: () => router.push(Routes.Signup),
  };
}
