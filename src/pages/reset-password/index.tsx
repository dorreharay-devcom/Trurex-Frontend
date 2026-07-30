import React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import { Button } from '~/shared/ui/Button';
import Input from '~/shared/ui/Input';
import { AuthBrandHeader, ResetPasswordExpiredState, useResetPassword } from '~/features/auth';
import { Routes } from '~/shared/config/routes';

const ResetPasswordPage = () => {
  const reset = useResetPassword();

  if (reset.recoveryLinkError) {
    return (
      <ResetPasswordExpiredState
        code={reset.recoveryLinkError.code}
        description={reset.recoveryLinkError.description}
        onBackToLogin={reset.handleBackToLogin}
      />
    );
  }

  if (!reset.hasRecoveryToken) {
    return <Redirect href={Routes.Login} />;
  }

  return (
    <AuthLayout>
      <AuthBrandHeader title="Set new password" subtitle="Enter and confirm your new password." />

      <View className="gap-4">
        <Input
          label="New password"
          value={reset.password}
          onChangeText={reset.onPasswordChange}
          placeholder="At least 6 characters"
          secure
          error={reset.errors.password}
          textContentType="newPassword"
        />

        <Input
          label="Confirm new password"
          value={reset.confirmPassword}
          onChangeText={reset.onConfirmPasswordChange}
          placeholder="Re-enter your new password"
          secure
          error={reset.errors.confirmPassword}
          textContentType="newPassword"
        />

        <Button
          title="Update password"
          onPress={reset.handleReset}
          loading={reset.loading}
          disabled={reset.submitDisabled}
          className="w-full"
        />

        {reset.errors.general && (
          <Text className="text-xs text-destructive text-center">{reset.errors.general}</Text>
        )}
      </View>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
