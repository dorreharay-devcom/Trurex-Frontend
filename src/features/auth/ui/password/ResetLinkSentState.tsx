import React from 'react';
import { Text, View } from 'react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import AuthBrandHeader from '~/features/auth/ui/common/AuthBrandHeader';
import BackToLoginLink from '~/features/auth/ui/common/BackToLoginLink';

type Props = {
  email: string;
  onBackToLogin: () => void;
};

const ResetLinkSentState = ({ email, onBackToLogin }: Props) => (
  <AuthLayout>
    <AuthBrandHeader title="Check your email" />
    <View className="items-center gap-4">
      <View className="items-center">
        <Text className="text-sm text-muted-foreground text-center">
          We sent a password reset link to
        </Text>
        <Text className="text-sm font-medium text-foreground text-center">{email}</Text>
      </View>
      <BackToLoginLink onPress={onBackToLogin} tone="accent" />
    </View>
  </AuthLayout>
);

export default ResetLinkSentState;
