import React, { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
  children: ReactNode;
};

const ProfileTapArea = ({ label, onPress, children }: Props) => {
  if (!onPress) {
    return <View className="min-w-0 flex-1 flex-row items-center gap-3">{children}</View>;
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${label}'s profile`}
      className="min-w-0 flex-1 flex-row items-center gap-3 rounded-lg active:opacity-70"
    >
      {children}
    </Pressable>
  );
};

export default ProfileTapArea;
