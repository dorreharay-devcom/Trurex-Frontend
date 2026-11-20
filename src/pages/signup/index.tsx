import React from 'react';
import { Text, View } from 'react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import AuthGeneralError from '~/features/auth/ui/common/AuthGeneralError';
import SignupAccountTypeTabs from '~/features/auth/ui/common/SignupAccountTypeTabs';
import { Button } from '~/shared/ui/primitives/Button';
import { Input } from '~/shared/ui/primitives/Input';
import {
  AuthBrandHeader,
  AuthOrDivider,
  AuthSwitchLink,
  AuthTermsAcceptanceField,
  InviteCodeInput,
  OAuthSocialButtons,
  useSignupByEmail,
} from '~/features/auth';
import { TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM } from '~/shared/config/featureFlags';

const SignupPage = () => {
  const signup = useSignupByEmail();

  return (
    <AuthLayout>
      <AuthBrandHeader subtitle="Create your TruRex account" />

      <View className="gap-4">
        {TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM && (
          <>
            <SignupAccountTypeTabs
              value={signup.accountType}
              onChange={signup.selectAccountType}
              disabled={signup.busy}
            />
            <View className="h-px bg-border" />
          </>
        )}
        <OAuthSocialButtons
          disabled={signup.busy}
          onGooglePress={() => signup.handleOAuthSignup('google')}
          onApplePress={() => signup.handleOAuthSignup('apple')}
        />
      </View>

      <AuthOrDivider />

      <View className="gap-6">
        <Input
          label={signup.accountConfig.nameLabel}
          value={signup.displayName}
          onChangeText={signup.onDisplayNameChange}
          placeholder={signup.accountConfig.namePlaceholder}
          autoCapitalize="words"
          error={signup.errors.displayName}
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

        <Input
          label="Referral code"
          labelRight={<Text className="text-xs text-muted-foreground">Optional</Text>}
          value={signup.referralCode}
          onChangeText={signup.onReferralCodeChange}
          placeholder="REX-XXXXX"
          autoCapitalize="characters"
        />

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
