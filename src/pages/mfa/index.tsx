import React from 'react';
import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import AuthLinkButton from '~/features/auth/ui/common/AuthLinkButton';
import { Button } from '~/shared/ui/primitives/Button';
import { Input } from '~/shared/ui/primitives/Input';
import { AuthBrandHeader, AuthTrustDeviceField, useMfaVerification } from '~/features/auth';

const MfaPage = () => {
  const mfa = useMfaVerification();
  const resendTitle = mfa.resending ? 'Sending...' : 'Send a new code';

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
          <AuthLinkButton
            title={resendTitle}
            onPress={mfa.handleResend}
            disabled={mfa.busy}
            centered
          />
          <AuthLinkButton
            title="Back to sign in"
            onPress={mfa.handleBackToLogin}
            disabled={mfa.busy}
            centered
          />
        </View>
      </View>
    </AuthLayout>
  );
};

export default MfaPage;
