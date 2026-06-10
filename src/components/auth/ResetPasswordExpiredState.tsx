import React from 'react';
import { Image, Text, View } from 'react-native';
import AuthLayout from '~/components/common/AuthLayout';
import { Button } from '~/components/common/Button';
import { isWeb } from '~/utils';

type Props = {
  code: string | null;
  description: string | null;
  onBackToLogin: () => void;
};

export function ResetPasswordExpiredState({ code, description, onBackToLogin }: Props) {
  const message =
    code === 'otp_expired'
      ? 'This password reset link is invalid or has expired.'
      : (description ?? 'This password reset link cannot be used.');

  return (
    <AuthLayout>
      <View className="items-center gap-4">
        <Image
          source={require('../../../assets/truRexLogo.png')}
          style={{ height: 40, resizeMode: 'contain' }}
        />
        <Text className="text-lg font-semibold text-foreground">Reset link expired</Text>
      </View>

      <View className={isWeb ? 'items-center space-y-4' : 'items-center gap-4'}>
        <Text className="text-sm text-muted-foreground text-center">{message}</Text>
        <Text className="text-sm text-muted-foreground text-center">
          Please request a new password reset link from the sign in page.
        </Text>
        <Button title="Back to sign in" onPress={onBackToLogin} className="w-full" />
      </View>
    </AuthLayout>
  );
}
