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

  if (mfa.awaitingBiometric) {
    return (
      <AuthLayout>
        <AuthBrandHeader
          title="Confirm it's you"
          subtitle="Use Face ID or Touch ID to finish signing in on this device."
        />

        <View className="gap-5">
          {mfa.error && <Text className="text-center text-xs text-destructive">{mfa.error}</Text>}

          <Button
            title="Try again"
            onPress={mfa.handleRetryBiometric}
            loading={mfa.retryingBiometric}
            className="w-full"
          />

          <AuthLinkButton
            title="Back to sign in"
            onPress={mfa.handleBackToLogin}
            disabled={mfa.busy}
            centered
          />
        </View>
      </AuthLayout>
    );
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
