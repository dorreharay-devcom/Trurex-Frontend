import React from 'react';
import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import AuthLinkButton from '~/features/auth/ui/common/AuthLinkButton';
import { Button } from '~/shared/ui/primitives/Button';
import { AuthBrandHeader } from '~/features/auth';
import { useIdentityVerificationPrompt } from '~/features/identity-verification/hooks/useIdentityVerificationPrompt';

const VerifyIdentityPage = () => {
  const verification = useIdentityVerificationPrompt();

  if (verification.redirectTo) {
    return <Redirect href={verification.redirectTo} />;
  }

  return (
    <AuthLayout>
      <AuthBrandHeader
        title="Let's make sure you're a real person"
        subtitle="Verify your identity with a government ID to get a verified badge on your profile. You can do this anytime from your profile if you'd rather skip it for now."
      />

      <View className="gap-5">
        {verification.error && (
          <Text className="text-center text-xs text-destructive">{verification.error}</Text>
        )}

        <Button
          title="Verify now"
          onPress={verification.handleVerifyNow}
          loading={verification.verifying}
          disabled={verification.busy}
          className="w-full"
        />

        <AuthLinkButton
          title="Skip for now"
          onPress={verification.handleSkip}
          disabled={verification.busy}
          centered
        />
      </View>
    </AuthLayout>
  );
};

export default VerifyIdentityPage;
