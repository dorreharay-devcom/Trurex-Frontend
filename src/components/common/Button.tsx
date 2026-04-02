import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Theme } from '~/theme/Theme';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Ghost = 'ghost',
  Danger = 'danger',
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

const buttonVariants: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'bg-black',
  [ButtonVariant.Secondary]: 'bg-white border border-gray-200',
  [ButtonVariant.Ghost]: 'bg-transparent',
  [ButtonVariant.Danger]: 'bg-red-500',
};

const textVariants: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'text-white',
  [ButtonVariant.Secondary]: 'text-black',
  [ButtonVariant.Ghost]: 'text-primary',
  [ButtonVariant.Danger]: 'text-white',
};

const spinnerColor: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: Theme.colors.white,
  [ButtonVariant.Secondary]: Theme.colors.black,
  [ButtonVariant.Ghost]: Theme.colors.primary,
  [ButtonVariant.Danger]: Theme.colors.white,
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = ButtonVariant.Primary,
  loading,
  disabled,
  className,
  textClassName,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    disabled={disabled || loading}
    className={`h-14 px-6 rounded-2xl items-center justify-center ${buttonVariants[variant]} ${disabled ? 'opacity-50' : ''} ${className ?? ''}`}
  >
    {loading ? (
      <ActivityIndicator color={spinnerColor[variant]} />
    ) : (
      <Text className={`text-base font-semibold ${textVariants[variant]} ${textClassName ?? ''}`}>
        {title}
      </Text>
    )}
  </TouchableOpacity>
);
