import React from 'react';
import { Pressable, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
};

function PrimaryActionButton({ icon: Icon, label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 active:bg-primary/90"
    >
      <Icon size={20} color={Theme.colors.primaryForeground} />
      <Text className="text-base font-semibold text-primary-foreground">{label}</Text>
    </Pressable>
  );
}

export default PrimaryActionButton;
