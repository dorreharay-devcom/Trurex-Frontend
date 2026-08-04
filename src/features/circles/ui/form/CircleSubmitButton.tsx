import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  label: string;
  disabled: boolean;
  pending: boolean;
  onPress: () => void;
  className?: string;
};

const CircleSubmitButton = ({ label, disabled, pending, onPress, className }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'items-center rounded-xl py-3',
        disabled
          ? 'cursor-not-allowed bg-primary/40 opacity-50'
          : 'cursor-pointer bg-primary active:opacity-90',
        className,
      )}
    >
      {pending ? (
        <ActivityIndicator color={Theme.colors.primaryForeground} />
      ) : (
        <Text className="text-sm font-semibold text-primary-foreground">{label}</Text>
      )}
    </Pressable>
  );
};

export default CircleSubmitButton;
