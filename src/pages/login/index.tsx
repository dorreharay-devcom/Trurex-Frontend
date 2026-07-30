import React from 'react';
import { View, Text } from 'react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import { Button } from '~/shared/ui/Button';
import Input from '~/shared/ui/Input';
import {
  AuthBrandHeader,
  AuthOrDivider,
  AuthSwitchLink,
  ForgotPasswordLink,
  InviteCodeInput,
  OAuthSocialButtons,
  useLoginByEmail,
} from '~/features/auth';

const LoginPage = () => {
  const {
    invite,
    email,
    password,
    errors,
    busy,
    loading,
    onEmailChange,
    onPasswordChange,
    handleOAuthLogin,
    handleLogin,
    goToForgotPassword,
    goToSignup,
  } = useLoginByEmail();

  return (
    <AuthLayout>
      <AuthBrandHeader subtitle="Sign in to your account" />

      <OAuthSocialButtons
        disabled={busy}
        onGooglePress={() => handleOAuthLogin('google')}
        onApplePress={() => handleOAuthLogin('apple')}
      />

      <AuthOrDivider />

      <View className="gap-6">
        <Input
          label="Email"
          value={email}
          onChangeText={onEmailChange}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={errors.email}
        />

        <Input
          label="Password"
          labelRight={<ForgotPasswordLink onPress={goToForgotPassword} />}
          value={password}
          onChangeText={onPasswordChange}
          placeholder="Your password"
          secure
          error={errors.password}
        />

        {invite.enabled && (
          <InviteCodeInput
            ref={invite.inputRef}
            value={invite.value}
            onChange={invite.onChange}
            error={invite.error}
          />
        )}

        <Button
          title="Sign in"
          onPress={handleLogin}
          loading={loading}
          disabled={busy}
          className="w-full"
        />
        {errors.general && (
          <Text className="mt-1 text-xs text-destructive text-center">{errors.general}</Text>
        )}
      </View>

      <AuthSwitchLink
        prompt="Don't have an account?"
        actionLabel="Sign up"
        onPress={goToSignup}
        accessibilityLabel="Sign up"
      />
    </AuthLayout>
  );
};

export default LoginPage;
