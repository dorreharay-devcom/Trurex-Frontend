import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn, webDisabledCursor } from '~/shared/lib/ui/styles';

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

type Props = {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
};

const PADDED = 'py-2.5 px-6 rounded-lg';
const BORDERED = `${PADDED} bg-card border border-border hover:bg-muted`;

const VARIANT: Record<ButtonVariant, { root: string; text: string; spinner: string }> = {
  [ButtonVariant.Primary]: {
    root: `${PADDED} bg-primary hover:bg-primary/90`,
    text: 'text-sm font-medium text-primary-foreground',
    spinner: Theme.colors.primaryForeground,
  },
  [ButtonVariant.Secondary]: {
    root: BORDERED,
    text: 'text-sm font-medium text-foreground',
    spinner: Theme.colors.foreground,
  },
  [ButtonVariant.Muted]: {
    root: `${PADDED} bg-muted hover:bg-muted/80`,
    text: 'text-sm font-medium text-muted-foreground',
    spinner: Theme.colors.muted,
  },
  [ButtonVariant.Ghost]: {
    root: `${PADDED} bg-transparent hover:bg-muted/10`,
    text: 'text-sm font-medium text-primary',
    spinner: Theme.colors.primary,
  },
  [ButtonVariant.Danger]: {
    root: `${PADDED} bg-destructive hover:bg-destructive/90`,
    text: 'text-sm font-medium text-white',
    spinner: Theme.colors.white,
  },
  [ButtonVariant.Outline]: {
    root: BORDERED,
    text: 'text-sm font-medium text-foreground',
    spinner: Theme.colors.foreground,
  },
  [ButtonVariant.Link]: {
    root: 'bg-transparent p-0 hover:underline',
    text: 'text-sm font-medium text-foreground',
    spinner: Theme.colors.foreground,
  },
};

export function Button({
  title,
  onPress,
  variant = ButtonVariant.Primary,
  loading = false,
  disabled = false,
  className,
  textClassName,
  icon,
}: Props) {
  const styles = VARIANT[variant];
  const isDisabled = disabled || loading;

  let body: React.ReactNode = null;
  if (loading) {
    body = <ActivityIndicator color={styles.spinner} />;
  } else {
    body = (
      <>
        {icon ? <View className={cn(!!title && 'mr-2')}>{icon}</View> : null}
        {title ? (
          <Text className={cn(styles.text, textClassName)} pointerEvents="none">
            {title}
          </Text>
        ) : null}
      </>
    );
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={onPress}
      style={webDisabledCursor(isDisabled)}
      className={cn(
        'flex-row items-center justify-center',
        styles.root,
        isDisabled && 'opacity-50',
        isWeb && (isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'),
        className,
      )}
    >
      {body}
    </TouchableOpacity>
  );
}
