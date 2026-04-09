import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Auth } from '~/services/AuthService';
import { AuthApi } from '~/api/AuthApi';
import { AuthEvent } from '~/services/AuthContext';
import { Routes } from '~/constants/routes';
import { Button } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { isWeb } from '~/utils';
import { mapAuthError } from '~/utils/errors';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (isWeb && typeof window !== 'undefined' && !window.location.hash.includes('type=recovery')) {
      router.replace(Routes.Login);
    }

    const {
      data: { subscription },
    } = Auth.onAuthStateChange((event) => {
      if (event === AuthEvent.PasswordRecovery) return;
      if (event === AuthEvent.SignedOut) router.replace(Routes.Login);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleReset = async () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      await AuthApi.updatePassword(password);
      Alert.alert('Password updated', 'You can now sign in with your new password.');
      router.replace(Routes.Main);
    } catch (err: unknown) {
      mapAuthError(err, (e) => setError(e.password || e.general));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View className="items-center gap-4">
        <Image
          source={require('../../assets/truRexLogo.png')}
          style={{ height: 40, resizeMode: 'contain' }}
        />
        <Text className="text-lg font-semibold text-foreground">Set new password</Text>
      </View>

      <View className="space-y-4">
        <Input
          label="New password"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setError(undefined);
          }}
          placeholder="At least 6 characters"
          secure
          error={error}
        />

        <Button
          title="Update password"
          onPress={handleReset}
          loading={loading}
          disabled={loading || !password}
          className="w-full"
        />
      </View>
    </AuthLayout>
  );
}
