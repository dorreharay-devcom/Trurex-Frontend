import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, Platform } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { Auth, initialUrlHadPasswordRecoveryToken } from '~/services/AuthService';
import { AuthApi } from '~/api/AuthApi';
import { AuthEvent } from '~/services/AuthContext';
import { Routes } from '~/constants/routes';
import { Button } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { mapAuthError } from '~/utils/errors';
import { ResetPasswordExpiredState } from '~/components/auth/ResetPasswordExpiredState';

type ResetErrors = {
  password?: string;
  confirmPassword?: string;
  general?: string;
};

type RecoveryLinkError = {
  code: string | null;
  description: string | null;
};

const currentUrlHasPasswordRecoveryToken = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  const tokenSource = `${window.location.search}${window.location.hash}`;
  return tokenSource.includes('type=recovery') && tokenSource.includes('access_token=');
};

const getCurrentRecoveryLinkError = (): RecoveryLinkError | null => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const params = new URLSearchParams(
    `${window.location.search.replace(/^\?/, '')}&${window.location.hash.replace(/^#/, '')}`,
  );
  const error = params.get('error');
  if (!error) return null;
  return {
    code: params.get('error_code'),
    description: params.get('error_description'),
  };
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
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
    let mounted = true;

    if (!hasRecoveryToken) {
      setRecoveryReady(false);
      setCheckingRecovery(false);
      return () => {
        mounted = false;
      };
    }

    Auth.getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        if (session) {
          setRecoveryReady(true);
        } else {
          setErrors({ general: 'Could not verify the reset link. Try again.' });
        }
      })
      .catch(() => {
        if (mounted) setErrors({ general: 'Could not verify the reset link. Try again.' });
      })
      .finally(() => {
        if (mounted) setCheckingRecovery(false);
      });

    const {
      data: { subscription },
    } = Auth.onAuthStateChange((event, session) => {
      if (event === AuthEvent.PasswordRecovery) {
        setRecoveryReady(Boolean(session));
        setCheckingRecovery(false);
        setErrors({});
        return;
      }
      if (event === AuthEvent.SignedOut) router.replace(Routes.Login);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [hasRecoveryToken, router]);

  const validate = () => {
    const next: ResetErrors = {};
    if (password.length < 6) {
      next.password = 'Password must be at least 6 characters';
    }
    if (confirmPassword.length === 0) {
      next.confirmPassword = 'Confirm your new password';
    } else if (password !== confirmPassword) {
      next.confirmPassword = 'Passwords do not match';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleReset = async () => {
    if (!recoveryReady) {
      setErrors({ general: 'Open the reset link from your email before setting a new password.' });
      return;
    }
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await AuthApi.updatePassword(password);
      Alert.alert('Password updated', 'You can now sign in with your new password.');
      router.replace(Routes.Main);
    } catch (err: unknown) {
      mapAuthError(err, (e) => setErrors({ password: e.password, general: e.general }));
    } finally {
      setLoading(false);
    }
  };

  const submitDisabled =
    loading || checkingRecovery || !recoveryReady || !password || !confirmPassword;

  if (recoveryLinkError) {
    return (
      <ResetPasswordExpiredState
        code={recoveryLinkError.code}
        description={recoveryLinkError.description}
        onBackToLogin={() => router.replace(Routes.Login)}
      />
    );
  }

  if (!hasRecoveryToken) {
    return <Redirect href={Routes.Login} />;
  }

  return (
    <AuthLayout>
      <View className="items-center gap-4">
        <Image
          source={require('../../assets/truRexLogo.png')}
          style={{ height: 40, resizeMode: 'contain' }}
        />
        <Text className="text-lg font-semibold text-foreground">Set new password</Text>
      </View>

      <View className={isWeb ? 'space-y-4' : 'gap-4'}>
        <Text className="text-sm text-muted-foreground text-center">
          Enter and confirm your new password.
        </Text>

        <Input
          label="New password"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setErrors((e) => ({ ...e, password: undefined, general: undefined }));
          }}
          placeholder="At least 6 characters"
          secure
          error={errors.password}
          textContentType="newPassword"
        />

        <Input
          label="Confirm new password"
          value={confirmPassword}
          onChangeText={(v) => {
            setConfirmPassword(v);
            setErrors((e) => ({ ...e, confirmPassword: undefined, general: undefined }));
          }}
          placeholder="Re-enter your new password"
          secure
          error={errors.confirmPassword}
          textContentType="newPassword"
        />

        <Button
          title="Update password"
          onPress={handleReset}
          loading={loading}
          disabled={submitDisabled}
          className="w-full"
        />

        {errors.general ? (
          <Text className="text-xs text-destructive text-center">{errors.general}</Text>
        ) : null}
      </View>
    </AuthLayout>
  );
}
