import React from 'react';
import { View, Text } from 'react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import { Button } from '~/shared/ui/Button';
import Input from '~/shared/ui/Input';
import {
  AuthBrandHeader,
  AuthOrDivider,
  AuthSwitchLink,
  AuthTermsAcceptanceField,
  InviteCodeInput,
  OAuthSocialButtons,
  useSignupByEmail,
} from '~/features/auth';

const SignupPage = () => {
  const {
    invite,
    email,
    password,
    fullName,
    errors,
    busy,
    loading,
    onFullNameChange,
    onEmailChange,
    onPasswordChange,
    handleOAuthSignup,
    handleSignup,
    goToLogin,
  } = useSignupByEmail();

  return (
    <AuthLayout>
      <AuthBrandHeader subtitle="Create your TruRex account" />

      <OAuthSocialButtons
        disabled={busy}
        onGooglePress={() => handleOAuthSignup('google')}
        onApplePress={() => handleOAuthSignup('apple')}
      />

      <AuthOrDivider />

      <View className="gap-6">
        <Input
          label="Full name"
          value={fullName}
          onChangeText={onFullNameChange}
          placeholder="Jane Doe"
          autoCapitalize="words"
          error={errors.fullName}
        />

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
          value={password}
          onChangeText={onPasswordChange}
          placeholder="At least 6 characters"
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

        <AuthTermsAcceptanceField />

        <Button
          title="Create account"
          onPress={handleSignup}
          loading={loading}
          disabled={busy}
          className="w-full"
        />
        {errors.general && (
          <Text className="mt-1 text-xs text-center text-destructive">{errors.general}</Text>
        )}
      </View>

      <AuthSwitchLink
        prompt="Already have an account?"
        actionLabel="Sign in"
        onPress={goToLogin}
        accessibilityLabel="Sign in"
        promptCentered
      />
    </AuthLayout>
  );
};

export default SignupPage;
