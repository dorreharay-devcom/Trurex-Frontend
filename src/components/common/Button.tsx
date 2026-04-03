
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Theme } from '~/theme/Theme';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Ghost = 'ghost',
  Danger = 'danger',
  Outline = 'outline',
  Link = 'link',
}

interface ButtonProps {
  title?: string;
  onPress: () => void;
  label?: string; 
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'h-14 px-6 bg-black rounded-2xl',
  [ButtonVariant.Secondary]: 'h-14 px-6 bg-white border border-gray-200 rounded-2xl',
  [ButtonVariant.Ghost]: 'h-14 px-6 bg-transparent rounded-2xl',
  [ButtonVariant.Danger]: 'h-14 px-6 bg-red-500 rounded-2xl',
  [ButtonVariant.Outline]: 'h-14 px-6 bg-white border border-gray-200 rounded-2xl shadow-sm',
  [ButtonVariant.Link]: 'h-auto p-0 bg-transparent',
};

const textVariants: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'text-white font-semibold',
  [ButtonVariant.Secondary]: 'text-black font-semibold',
  [ButtonVariant.Ghost]: 'text-primary font-semibold',
  [ButtonVariant.Danger]: 'text-white font-semibold',
  [ButtonVariant.Outline]: 'text-black font-bold',
  [ButtonVariant.Link]: 'text-black font-bold',
};

const spinnerColor: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: Theme.colors.white,
  [ButtonVariant.Secondary]: Theme.colors.black,
  [ButtonVariant.Ghost]: Theme.colors.primary,
  [ButtonVariant.Danger]: Theme.colors.white,
  [ButtonVariant.Outline]: Theme.colors.black,
  [ButtonVariant.Link]: Theme.colors.black,
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  label,
  variant = ButtonVariant.Primary,
  loading,
  disabled,
  className,
  textClassName,
  labelClassName,
  icon,
}) => {
  const isLink = variant === ButtonVariant.Link;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${buttonVariants[variant]} ${disabled ? 'opacity-50' : ''} ${className ?? ''}`}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor[variant]} />
      ) : (
        <>
          {icon && <View className={title ? 'mr-2' : ''}>{icon}</View>}
          <View className="flex-row items-center">
            {label && (
              <Text className={`text-gray-500 font-medium mr-1.5 ${labelClassName ?? ''}`}>
                {label}
              </Text>
            )}
            <Text className={`text-base ${textVariants[variant]} ${textClassName ?? ''}`}>
              {title}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};
