import React from 'react';
import { Pressable, Text } from 'react-native';

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const AuthPillButton = ({ icon, label, onPress, disabled }: Props) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    disabled={disabled}
    onPress={onPress}
    className={`w-full flex-row items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white px-5 py-3.5 shadow-sm active:bg-neutral-50 ${disabled ? 'opacity-50' : ''}`}
  >
    {icon}
    <Text className="text-[15px] font-semibold text-[#1f1f1f]">{label}</Text>
  </Pressable>
);

export default AuthPillButton;
