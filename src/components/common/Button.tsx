import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, Platform } from 'react-native';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';

const isWeb = Platform.OS === 'web';

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
  [ButtonVariant.Primary]: 'py-2.5 px-6 bg-primary rounded-lg hover:bg-primary/90',
  [ButtonVariant.Secondary]: 'py-2.5 px-6 bg-card border border-border rounded-lg hover:bg-muted',
  [ButtonVariant.Muted]: 'py-2.5 px-6 bg-muted rounded-lg hover:bg-muted/80',
  [ButtonVariant.Ghost]: 'py-2.5 px-6 bg-transparent rounded-lg hover:bg-muted/10',
  [ButtonVariant.Danger]: 'py-2.5 px-6 bg-destructive rounded-lg hover:bg-destructive/90',
  [ButtonVariant.Outline]: 'py-2.5 px-6 bg-card border border-border rounded-lg hover:bg-muted',
  [ButtonVariant.Link]: 'p-0 bg-transparent hover:underline',
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
  const isDisabled = Boolean(disabled || loading);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isDisabled}
      style={isDisabled && isWeb ? ({ cursor: 'not-allowed' } as const) : undefined}
      className={cn(
        'flex-row items-center justify-center',
        buttonVariants[variant],
        isDisabled ? 'cursor-not-allowed opacity-50' : isWeb && 'cursor-pointer',
        className,
      )}
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
