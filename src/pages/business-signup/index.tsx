import React from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import AuthGeneralError from '~/features/auth/ui/common/AuthGeneralError';
import AuthLinkButton from '~/features/auth/ui/common/AuthLinkButton';
import { Button } from '~/shared/ui/primitives/Button';
import { Input } from '~/shared/ui/primitives/Input';
import { AuthBrandHeader } from '~/features/auth';
import { useBusinessSignupCompletion } from '~/features/auth/hooks/useBusinessSignupCompletion';
import { Routes } from '~/shared/config/routes';
import { TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM } from '~/shared/config/featureFlags';

const BusinessSignupPage = () => {
  const completion = useBusinessSignupCompletion();

  if (!TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM) {
    return <Redirect href={Routes.Main} />;
  }

  if (completion.redirectTo) {
    return <Redirect href={completion.redirectTo} />;
  }

  return (
    <AuthLayout>
      <AuthBrandHeader
        title="Set up your business"
        subtitle="Add your business name to finish creating your business account."
      />

      <View className="gap-6">
        <Input
          label={completion.accountConfig.nameLabel}
          value={completion.businessName}
          onChangeText={completion.onBusinessNameChange}
          placeholder={completion.accountConfig.namePlaceholder}
          autoCapitalize="words"
          error={completion.errors.businessName}
        />

        <Button
          title="Continue"
          onPress={completion.handleSubmit}
          loading={completion.submitting}
          disabled={completion.busy}
          className="w-full"
        />
        <AuthGeneralError message={completion.errors.general} className="mt-1" />
      </View>

      <AuthLinkButton
        title="Sign out"
        onPress={completion.handleSignOut}
        disabled={completion.busy}
        centered
      />
    </AuthLayout>
  );
};

export default BusinessSignupPage;
