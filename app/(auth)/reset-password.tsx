import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Auth } from '~/services/AuthService';
import { AuthEvent } from '~/services/AuthContext';
import { Routes } from '~/constants/routes';
import { Button } from '~/components/common/Button';
import AuthLayout from '~/components/common/AuthLayout';
import Input from '~/components/common/Input';
import { isWeb } from '~/utils';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const { error } = await Auth.updateUser({ password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Password updated', 'You can now sign in with your new password.');
      router.replace(Routes.Main);
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
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secure
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
