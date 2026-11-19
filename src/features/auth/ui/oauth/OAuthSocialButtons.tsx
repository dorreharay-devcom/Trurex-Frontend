import React from 'react';
import { View } from 'react-native';
import AuthPillButton from '~/features/auth/ui/oauth/AuthPillButton';
import GoogleGMark from '~/features/auth/ui/oauth/GoogleGMark';
import AppleLogoMark from '~/features/auth/ui/oauth/AppleLogoMark';

type Props = {
  onGooglePress: () => void;
  onApplePress: () => void;
  disabled?: boolean;
};

const OAuthSocialButtons = ({ onGooglePress, onApplePress, disabled }: Props) => (
  <View className="w-full gap-3">
    <AuthPillButton
      icon={<GoogleGMark size={20} />}
      label="Continue with Google"
      onPress={onGooglePress}
      disabled={disabled}
    />
    <AuthPillButton
      icon={<AppleLogoMark size={20} />}
      label="Continue with Apple"
      onPress={onApplePress}
      disabled={disabled}
    />
  </View>
);

export default OAuthSocialButtons;
