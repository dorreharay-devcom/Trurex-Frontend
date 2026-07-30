import React from 'react';
import { View, Text } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import { Button, ButtonVariant } from '~/shared/ui/Button';
import Input from '~/shared/ui/Input';
import { AuthBrandHeader, useForgotPassword } from '~/features/auth';
import { Theme } from '~/shared/theme/Theme';

const ForgotPasswordPage = () => {
  const forgot = useForgotPassword();

  if (forgot.sent) {
    return (
      <AuthLayout>
        <AuthBrandHeader title="Check your email" />
        <View className="items-center gap-4">
          <View className="items-center">
            <Text className="text-sm text-muted-foreground text-center">
              We sent a password reset link to
            </Text>
            <Text className="text-sm font-medium text-foreground text-center">{forgot.email}</Text>
          </View>
          <Button
            variant={ButtonVariant.Link}
            onPress={forgot.goToLogin}
            icon={<ArrowLeft size={16} color={Theme.colors.accentForeground} />}
            title="Back to sign in"
            textClassName="text-sm text-accent-foreground font-normal"
            className="hover:no-underline active:no-underline"
          />
        </View>
      </AuthLayout>
    );
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

        <Button
          variant={ButtonVariant.Link}
          onPress={forgot.goToLogin}
          icon={<ArrowLeft size={16} color={Theme.colors.muted} />}
          title="Back to sign in"
          textClassName="text-sm text-muted-foreground font-normal"
          className="self-center hover:no-underline active:no-underline"
        />
      </View>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
