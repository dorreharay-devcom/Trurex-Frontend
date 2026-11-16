import React, { type ReactNode } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn, withWebContainer } from '~/shared/lib/ui/styles';

const ICON_TONE_CLASS = {
  primary: 'bg-primary/10',
  warning: 'bg-warning/15',
} as const;

export type BusinessDialogTone = keyof typeof ICON_TONE_CLASS;

type Props = {
  icon: ReactNode;
  iconTone?: BusinessDialogTone;
  title: string;
  message?: string;
  children?: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

function BusinessSheetDialog({
  icon,
  iconTone = 'primary',
  title,
  message,
  children,
  primaryLabel,
  onPrimary,
  primaryLoading = false,
  primaryDisabled = false,
  secondaryLabel,
  onSecondary,
}: Props) {
  const primaryBlocked = primaryLoading || primaryDisabled;

  return (
    <View
      style={withWebContainer({
        paddingHorizontal: 16,
        paddingTop: isWeb ? 24 : 0,
        paddingBottom: 24,
      })}
    >
      <View
        className={cn(
          'mb-4 h-12 w-12 items-center justify-center self-center rounded-full',
          ICON_TONE_CLASS[iconTone],
        )}
      >
        {icon}
      </View>
      <Text
        className="mb-1 text-center font-display text-lg font-bold text-foreground"
        accessibilityRole="header"
      >
        {title}
      </Text>
      {message ? (
        <Text className="mb-4 text-center text-sm leading-relaxed text-muted-foreground">
          {message}
        </Text>
      ) : null}
      {children}
      <View className="mt-2 flex-row gap-3">
        {secondaryLabel && onSecondary ? (
          <TouchableOpacity
            onPress={onSecondary}
            disabled={primaryLoading}
            activeOpacity={0.85}
            accessibilityRole="button"
            className="flex-1 items-center rounded-xl border border-border bg-muted/50 py-2.5"
          >
            <Text className="text-sm font-semibold text-foreground">{secondaryLabel}</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={onPrimary}
          disabled={primaryBlocked}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ disabled: primaryBlocked, busy: primaryLoading }}
          className={cn(
            'flex-1 items-center justify-center rounded-xl bg-primary py-2.5',
            primaryDisabled && 'opacity-50',
          )}
        >
          {primaryLoading ? (
            <ActivityIndicator size="small" color={Theme.colors.background} />
          ) : (
            <Text className="text-sm font-semibold text-primary-foreground">{primaryLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default BusinessSheetDialog;
