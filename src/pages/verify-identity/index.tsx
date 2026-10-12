import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import AuthLinkButton from '~/features/auth/ui/common/AuthLinkButton';
import { Button } from '~/shared/ui/primitives/Button';
import { AuthBrandHeader } from '~/features/auth';
import { Theme } from '~/shared/theme/Theme';
import { useIdentityVerificationPrompt } from '~/features/identity-verification/hooks/useIdentityVerificationPrompt';

const VerifyIdentityPage = () => {
  const verification = useIdentityVerificationPrompt();
  const insets = useSafeAreaInsets();

  if (verification.redirectTo) {
    return <Redirect href={verification.redirectTo} />;
  }

  return (
    <View className="flex-1 bg-background">
      {verification.showBack ? (
        <View style={{ paddingTop: insets.top + 16 }} className="px-4">
          <TouchableOpacity
            onPress={verification.handleBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            className="flex-row items-center gap-1 self-start py-2"
          >
            <ArrowLeft size={16} color={Theme.colors.muted} />
            <Text className="text-sm text-muted-foreground">Back</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <AuthLayout>
        <AuthBrandHeader
          title="Let's make sure you're a real person"
          subtitle={
            verification.showSkip
              ? "Confirm it's you with Face ID or Touch ID to get a verified badge on your profile. You can do this anytime from your profile if you'd rather skip it for now."
              : "Confirm it's you with Face ID or Touch ID to get a verified badge on your profile."
          }
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

          {verification.showSkip ? (
            <AuthLinkButton
              title="Skip for now"
              onPress={verification.handleSkip}
              disabled={verification.busy}
              centered
            />
          ) : null}
        </View>
      </AuthLayout>
    </View>
  );
};

export default VerifyIdentityPage;
