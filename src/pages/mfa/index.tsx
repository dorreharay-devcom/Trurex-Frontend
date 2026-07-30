import React from 'react';
import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import { Button, ButtonVariant } from '~/shared/ui/Button';
import Input from '~/shared/ui/Input';
import { AuthBrandHeader, AuthTrustDeviceField, useMfaVerification } from '~/features/auth';

const MfaPage = () => {
  const mfa = useMfaVerification();

  if (mfa.redirectTo) {
    return <Redirect href={mfa.redirectTo} />;
  }

  return (
    <AuthLayout>
      <AuthBrandHeader
        title="Verify your sign in"
        subtitle="We sent a one-time code to your email for this new device."
      />

      <View className="gap-5">
        <Input
          label="Verification code"
          value={mfa.code}
          onChangeText={mfa.onCodeChange}
          placeholder="123456"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          error={mfa.error}
        />

        {mfa.notice && (
          <Text className="text-center text-xs text-muted-foreground">{mfa.notice}</Text>
        )}

        <AuthTrustDeviceField checked={mfa.trustDevice} onToggle={mfa.toggleTrustDevice} />

        <Button
          title="Verify"
          onPress={mfa.handleVerify}
          loading={mfa.verifying}
          disabled={!mfa.canSubmit}
          className="w-full"
        />

        <View className="items-center gap-3">
          <Button
            title={mfa.resending ? 'Sending...' : 'Send a new code'}
            onPress={mfa.handleResend}
            variant={ButtonVariant.Link}
            disabled={mfa.busy}
            textClassName="text-sm text-muted-foreground font-normal"
            className="self-center hover:no-underline active:no-underline"
          />
          <Button
            title="Back to sign in"
            onPress={mfa.handleBackToLogin}
            variant={ButtonVariant.Link}
            disabled={mfa.busy}
            textClassName="text-sm text-muted-foreground font-normal"
            className="self-center hover:no-underline active:no-underline"
          />
        </View>
      </View>
    </AuthLayout>
  );
};

export default MfaPage;
