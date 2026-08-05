import React from 'react';
import { Text, View } from 'react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import { Button } from '~/shared/ui/primitives/Button';
import AuthBrandHeader from '~/features/auth/ui/common/AuthBrandHeader';
import { RecoveryLinkErrorCode, ResetPasswordMessage } from '~/features/auth/lib/password';

type Props = {
  code: string | null;
  description: string | null;
  onBackToLogin: () => void;
};

const ResetPasswordExpiredState = ({ code, description, onBackToLogin }: Props) => {
  const message =
    code === RecoveryLinkErrorCode.OtpExpired
      ? ResetPasswordMessage.linkExpired
      : (description ?? ResetPasswordMessage.linkUnusable);

  return (
    <AuthLayout>
      <AuthBrandHeader title="Reset link expired" />

      <View className="items-center gap-4">
        <Text className="text-sm text-muted-foreground text-center">{message}</Text>
        <Text className="text-sm text-muted-foreground text-center">
          {ResetPasswordMessage.requestNewLink}
        </Text>
        <Button title="Back to sign in" onPress={onBackToLogin} className="w-full" />
      </View>
    </AuthLayout>
  );
};

export default ResetPasswordExpiredState;
