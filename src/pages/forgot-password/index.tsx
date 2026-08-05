import React from 'react';
import { View } from 'react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import BackToLoginLink from '~/features/auth/ui/common/BackToLoginLink';
import ResetLinkSentState from '~/features/auth/ui/password/ResetLinkSentState';
import { Button } from '~/shared/ui/primitives/Button';
import { Input } from '~/shared/ui/primitives/Input';
import { AuthBrandHeader, useForgotPassword } from '~/features/auth';

const ForgotPasswordPage = () => {
  const forgot = useForgotPassword();

  if (forgot.sent) {
    return <ResetLinkSentState email={forgot.email} onBackToLogin={forgot.goToLogin} />;
  }

  return (
    <AuthLayout>
      <AuthBrandHeader
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link"
      />

      <View className="gap-8">
        <View className="gap-4">
          <Input
            label="Email"
            value={forgot.email}
            onChangeText={forgot.onEmailChange}
            placeholder="you@example.com"
            keyboardType="email-address"
            error={forgot.error}
          />

          <Button
            title="Send reset link"
            onPress={forgot.handleReset}
            loading={forgot.loading}
            disabled={forgot.resetDisabled}
            className="w-full"
          />
        </View>

        <BackToLoginLink onPress={forgot.goToLogin} centered />
      </View>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
