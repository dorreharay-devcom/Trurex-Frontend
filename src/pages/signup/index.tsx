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
  AuthTermsAcceptanceField,
  InviteCodeInput,
  OAuthSocialButtons,
  useSignupByEmail,
} from '~/features/auth';

const SignupPage = () => {
  const signup = useSignupByEmail();

  return (
    <AuthLayout>
      <AuthBrandHeader subtitle="Create your TruRex account" />

      <OAuthSocialButtons
        disabled={signup.busy}
        onGooglePress={() => signup.handleOAuthSignup('google')}
        onApplePress={() => signup.handleOAuthSignup('apple')}
      />

      <AuthOrDivider />

      <View className="gap-6">
        <Input
          label="Full name"
          value={signup.fullName}
          onChangeText={signup.onFullNameChange}
          placeholder="Jane Doe"
          autoCapitalize="words"
          error={signup.errors.fullName}
        />

        <Input
          label="Email"
          value={signup.email}
          onChangeText={signup.onEmailChange}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={signup.errors.email}
        />

        <Input
          label="Password"
          value={signup.password}
          onChangeText={signup.onPasswordChange}
          placeholder="At least 6 characters"
          secure
          error={signup.errors.password}
        />

        {signup.invite.enabled && (
          <InviteCodeInput
            ref={signup.invite.inputRef}
            value={signup.invite.value}
            onChange={signup.invite.onChange}
            error={signup.invite.error}
          />
        )}

        <AuthTermsAcceptanceField />

        <Button
          title="Create account"
          onPress={signup.handleSignup}
          loading={signup.loading}
          disabled={signup.busy}
          className="w-full"
        />
        <AuthGeneralError message={signup.errors.general} className="mt-1" />
      </View>

      <AuthSwitchLink
        prompt="Already have an account?"
        actionLabel="Sign in"
        onPress={signup.goToLogin}
        accessibilityLabel="Sign in"
        promptCentered
      />
    </AuthLayout>
  );
};

export default SignupPage;
