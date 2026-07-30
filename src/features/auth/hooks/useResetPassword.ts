import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Auth } from '~/shared/api/client';
import { AuthApi } from '~/shared/api/auth';
import { Routes } from '~/shared/config/routes';
import {
  getConfirmPasswordValidationError,
  getPasswordValidationError,
  isFieldErrorsEmpty,
} from '~/features/auth/lib/credentials';
import { mapAuthError } from '~/features/auth/lib/errors';
import { AuthEvent } from '~/features/auth/types/authEvent';
import {
  currentUrlHasPasswordRecoveryToken,
  getCurrentRecoveryLinkError,
  initialUrlHadPasswordRecoveryToken,
  ResetPasswordMessage,
} from '~/features/auth/lib/password';

type ResetErrors = {
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export function useResetPassword() {
  const router = useRouter();
  const hasRecoveryToken =
    initialUrlHadPasswordRecoveryToken || currentUrlHasPasswordRecoveryToken();
  const recoveryLinkError = getCurrentRecoveryLinkError();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [errors, setErrors] = useState<ResetErrors>({});

  useEffect(() => {
    if (!hasRecoveryToken) {
      setRecoveryReady(false);
      setCheckingRecovery(false);
      return;
    }

    let mounted = true;

    function markReady() {
      if (!mounted) return;
      setRecoveryReady(true);
      setCheckingRecovery(false);
      setErrors({});
    }

    function markFailed() {
      if (!mounted) return;
      setRecoveryReady(false);
      setCheckingRecovery(false);
      setErrors({ general: ResetPasswordMessage.verifyFailed });
    }

    Auth.getSession()
      .then(({ data: { session } }) => {
        if (session) markReady();
        else markFailed();
      })
      .catch(markFailed);

    const {
      data: { subscription },
    } = Auth.onAuthStateChange((event, session) => {
      if (event === AuthEvent.PasswordRecovery) {
        if (session) markReady();
        else markFailed();
        return;
      }
      if (event === AuthEvent.SignedOut) router.replace(Routes.Login);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [hasRecoveryToken, router]);

  function validateForm(): boolean {
    const fieldErrors = {
      password: getPasswordValidationError(password),
      confirmPassword: getConfirmPasswordValidationError(password, confirmPassword),
    };
    setErrors(fieldErrors);
    return isFieldErrorsEmpty(fieldErrors);
  }

  async function handleReset() {
    if (!recoveryReady) {
      setErrors({ general: ResetPasswordMessage.openLinkFirst });
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    try {
      await AuthApi.updatePassword(password);
      Alert.alert(ResetPasswordMessage.updatedTitle, ResetPasswordMessage.updatedBody);
      router.replace(Routes.Main);
    } catch (err: unknown) {
      mapAuthError(err, (e) => setErrors({ password: e.password, general: e.general }));
    } finally {
      setLoading(false);
    }
  }

  async function handleBackToLogin() {
    await AuthApi.signOut().catch(() => {});
    router.replace(Routes.Login);
  }

  return {
    hasRecoveryToken,
    recoveryLinkError,
    password,
    confirmPassword,
    loading,
    errors,
    submitDisabled: loading || checkingRecovery || !recoveryReady || !password || !confirmPassword,
    onPasswordChange: (value: string) => {
      setPassword(value);
      setErrors((e) => ({ ...e, password: undefined, general: undefined }));
    },
    onConfirmPasswordChange: (value: string) => {
      setConfirmPassword(value);
      setErrors((e) => ({ ...e, confirmPassword: undefined, general: undefined }));
    },
    handleReset,
    handleBackToLogin,
  };
}
