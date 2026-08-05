import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthApi } from '~/shared/api/authApi';
import { Routes } from '~/shared/config/routes';
import { getEmailValidationError } from '~/features/auth/lib/credentials';
import { mapAuthError } from '~/features/auth/lib/errors';
import { getResetPasswordRedirectUrl } from '~/features/auth/lib/redirect';

export function useForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();

  function onEmailChange(value: string) {
    setEmail(value);
    setError(undefined);
  }

  async function handleReset() {
    const emailError = getEmailValidationError(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      await AuthApi.resetPassword(email, getResetPasswordRedirectUrl());
      setSent(true);
    } catch (err: unknown) {
      mapAuthError(err, (e) => setError(e.email || e.general));
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    loading,
    sent,
    error,
    resetDisabled: loading || !email,
    onEmailChange,
    handleReset,
    goToLogin: () => router.replace(Routes.Login),
  };
}
