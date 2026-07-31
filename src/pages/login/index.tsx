import React from 'react';
import { View } from 'react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import AuthGeneralError from '~/features/auth/ui/common/AuthGeneralError';
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
  const login = useLoginByEmail();

  return (
    <AuthLayout>
      <AuthBrandHeader subtitle="Sign in to your account" />

      <OAuthSocialButtons
        disabled={login.busy}
        onGooglePress={() => login.handleOAuthLogin('google')}
        onApplePress={() => login.handleOAuthLogin('apple')}
      />

      <AuthOrDivider />

      <View className="gap-6">
        <Input
          label="Email"
          value={login.email}
          onChangeText={login.onEmailChange}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={login.errors.email}
        />

        <Input
          label="Password"
          labelRight={<ForgotPasswordLink onPress={login.goToForgotPassword} />}
          value={login.password}
          onChangeText={login.onPasswordChange}
          placeholder="Your password"
          secure
          error={login.errors.password}
        />

        {login.invite.enabled && (
          <InviteCodeInput
            ref={login.invite.inputRef}
            value={login.invite.value}
            onChange={login.invite.onChange}
            error={login.invite.error}
          />
        )}

        <Button
          title="Sign in"
          onPress={login.handleLogin}
          loading={login.loading}
          disabled={login.busy}
          className="w-full"
        />
        <AuthGeneralError message={login.errors.general} className="mt-1" />
      </View>

      <AuthSwitchLink
        prompt="Don't have an account?"
        actionLabel="Sign up"
        onPress={login.goToSignup}
        accessibilityLabel="Sign up"
      />
    </AuthLayout>
  );
};

export default LoginPage;
