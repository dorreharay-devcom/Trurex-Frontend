import React from 'react';
import { Pressable, Text, View } from 'react-native';
import GoogleGMark from '~/features/auth/ui/oauth/GoogleGMark';
import AppleLogoMark from '~/features/auth/ui/oauth/AppleLogoMark';

const pillClass =
  'w-full flex-row items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white py-3.5 px-5 shadow-sm active:bg-neutral-50';

type Props = {
  onGooglePress: () => void;
  onApplePress: () => void;
  disabled?: boolean;
};

const OAuthSocialButtons = ({ onGooglePress, onApplePress, disabled }: Props) => {
  return (
    <View className="w-full gap-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
        disabled={disabled}
        onPress={onGooglePress}
        className={`${pillClass} ${disabled ? 'opacity-50' : ''}`}
      >
        <GoogleGMark size={20} />
        <Text className="text-[15px] font-semibold text-[#1f1f1f]">Continue with Google</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue with Apple"
        disabled={disabled}
        onPress={onApplePress}
        className={`${pillClass} ${disabled ? 'opacity-50' : ''}`}
      >
        <AppleLogoMark size={20} />
        <Text className="text-[15px] font-semibold text-[#1f1f1f]">Continue with Apple</Text>
      </Pressable>
    </View>
  );
};

export default OAuthSocialButtons;
