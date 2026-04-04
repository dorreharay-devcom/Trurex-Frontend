import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Theme } from '~/theme/Theme';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Muted = 'muted',
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
  [ButtonVariant.Primary]: 'py-2.5 px-6 bg-primary rounded-lg',
  [ButtonVariant.Secondary]: 'py-2.5 px-6 bg-card border border-border rounded-lg',
  [ButtonVariant.Muted]: 'py-2.5 px-6 bg-muted rounded-lg',
  [ButtonVariant.Ghost]: 'py-2.5 px-6 bg-transparent rounded-lg',
  [ButtonVariant.Danger]: 'py-2.5 px-6 bg-destructive rounded-lg',
  [ButtonVariant.Outline]: 'py-2.5 px-6 bg-card border border-border rounded-lg',
  [ButtonVariant.Link]: 'p-0 bg-transparent',
};

const textVariants: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'text-primary-foreground font-medium',
  [ButtonVariant.Secondary]: 'text-foreground font-medium',
  [ButtonVariant.Muted]: 'text-muted-foreground font-medium',
  [ButtonVariant.Ghost]: 'text-primary font-medium',
  [ButtonVariant.Danger]: 'text-white font-medium',
  [ButtonVariant.Outline]: 'text-foreground font-medium',
  [ButtonVariant.Link]: 'text-foreground font-medium',
};

const spinnerColor: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: Theme.colors.primaryForeground,
  [ButtonVariant.Secondary]: Theme.colors.foreground,
  [ButtonVariant.Muted]: Theme.colors.muted,
  [ButtonVariant.Ghost]: Theme.colors.primary,
  [ButtonVariant.Danger]: Theme.colors.white,
  [ButtonVariant.Outline]: Theme.colors.foreground,
  [ButtonVariant.Link]: Theme.colors.foreground,
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
            <Text className={`text-sm ${textVariants[variant]} ${textClassName ?? ''}`}>
              {title}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};
