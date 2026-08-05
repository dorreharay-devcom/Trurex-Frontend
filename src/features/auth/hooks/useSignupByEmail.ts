import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthApi } from '~/shared/api/authApi';
import { Routes } from '~/shared/config/routes';
import {
  getEmailValidationError,
  getFullNameValidationError,
  getPasswordValidationError,
  isFieldErrorsEmpty,
} from '~/features/auth/lib/credentials';
import { mapAuthError } from '~/features/auth/lib/errors';
import { getRedirectUrl } from '~/features/auth/lib/redirect';
import { useAuthInviteCode } from '~/features/auth/hooks/useAuthInviteCode';
import { persistTermsAcceptance } from '~/features/auth/lib/terms';
import type { OAuthProvider } from '~/features/auth/lib/oauth';
import { useOAuthSignIn } from '~/features/auth/hooks/useOAuthSignIn';

type SignupErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  general?: string;
};

export function useSignupByEmail() {
  const router = useRouter();
  const { signInWithOAuth, oauthPending } = useOAuthSignIn();
  const invite = useAuthInviteCode();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);

  function validateForm(): boolean {
    const fieldErrors = {
      fullName: getFullNameValidationError(fullName),
      email: getEmailValidationError(email),
      password: getPasswordValidationError(password),
    };
    setErrors(fieldErrors);
    return isFieldErrorsEmpty(fieldErrors) && invite.validate();
  }

  async function handleSignup() {
    if (!validateForm()) return;

    await persistTermsAcceptance();
    setLoading(true);
    setErrors({});

    try {
      await AuthApi.signUp({
        email,
        password,
        redirectTo: getRedirectUrl(),
        displayName: fullName,
      });
      router.replace(Routes.Login);
    } catch (error: unknown) {
      mapAuthError(error, setErrors);
    } finally {
      setLoading(false);
    }
  }

  function handleOAuthSignup(provider: OAuthProvider) {
    if (!invite.validate()) return;
    void persistTermsAcceptance();
    signInWithOAuth(provider);
  }

  return {
    invite,
    email,
    password,
    fullName,
    errors,
    loading,
    oauthPending,
    busy: oauthPending || loading,
    onFullNameChange: (value: string) => {
      setFullName(value);
      setErrors((e) => ({ ...e, fullName: undefined, general: undefined }));
    },
    onEmailChange: (value: string) => {
      setEmail(value);
      setErrors((e) => ({ ...e, email: undefined, general: undefined }));
    },
    onPasswordChange: (value: string) => {
      setPassword(value);
      setErrors((e) => ({ ...e, password: undefined, general: undefined }));
    },
    handleOAuthSignup,
    handleSignup,
    goToLogin: () => router.replace(Routes.Login),
  };
}
