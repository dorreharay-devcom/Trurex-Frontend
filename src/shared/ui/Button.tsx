import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn, webDisabledCursorStyle } from '~/utils/general';
import { isWeb } from '~/utils';

export const ButtonVariant = {
  Primary: 'primary',
  Secondary: 'secondary',
  Muted: 'muted',
  Ghost: 'ghost',
  Danger: 'danger',
  Outline: 'outline',
  Link: 'link',
} as const;

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

type ButtonProps = {
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
};

const buttonClassByVariant: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'py-2.5 px-6 bg-primary rounded-lg hover:bg-primary/90',
  [ButtonVariant.Secondary]: 'py-2.5 px-6 bg-card border border-border rounded-lg hover:bg-muted',
  [ButtonVariant.Muted]: 'py-2.5 px-6 bg-muted rounded-lg hover:bg-muted/80',
  [ButtonVariant.Ghost]: 'py-2.5 px-6 bg-transparent rounded-lg hover:bg-muted/10',
  [ButtonVariant.Danger]: 'py-2.5 px-6 bg-destructive rounded-lg hover:bg-destructive/90',
  [ButtonVariant.Outline]: 'py-2.5 px-6 bg-card border border-border rounded-lg hover:bg-muted',
  [ButtonVariant.Link]: 'p-0 bg-transparent hover:underline',
};

const textClassByVariant: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'text-primary-foreground font-medium',
  [ButtonVariant.Secondary]: 'text-foreground font-medium',
  [ButtonVariant.Muted]: 'text-muted-foreground font-medium',
  [ButtonVariant.Ghost]: 'text-primary font-medium',
  [ButtonVariant.Danger]: 'text-white font-medium',
  [ButtonVariant.Outline]: 'text-foreground font-medium',
  [ButtonVariant.Link]: 'text-foreground font-medium',
};

const spinnerColorByVariant: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: Theme.colors.primaryForeground,
  [ButtonVariant.Secondary]: Theme.colors.foreground,
  [ButtonVariant.Muted]: Theme.colors.muted,
  [ButtonVariant.Ghost]: Theme.colors.primary,
  [ButtonVariant.Danger]: Theme.colors.white,
  [ButtonVariant.Outline]: Theme.colors.foreground,
  [ButtonVariant.Link]: Theme.colors.foreground,
};

export const Button = ({
  title,
  onPress,
  label,
  variant = ButtonVariant.Primary,
  loading = false,
  disabled = false,
  className,
  textClassName,
  labelClassName,
  icon,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isDisabled}
      style={isDisabled && isWeb ? webDisabledCursorStyle : undefined}
      className={cn(
        'flex-row items-center justify-center',
        buttonClassByVariant[variant],
        isDisabled ? 'cursor-not-allowed opacity-50' : isWeb && 'cursor-pointer',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColorByVariant[variant]} />
      ) : (
        <>
          {icon ? <View className={title ? 'mr-2' : undefined}>{icon}</View> : null}
          <View className="flex-row items-center">
            {label ? (
              <Text className={cn('mr-1.5 font-medium text-gray-500', labelClassName)}>
                {label}
              </Text>
            ) : null}
            {title ? (
              <Text className={cn('text-sm', textClassByVariant[variant], textClassName)}>
                {title}
              </Text>
            ) : null}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};
