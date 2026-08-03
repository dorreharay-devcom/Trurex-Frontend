import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

const PILL_VARIANTS = {
  primary: {
    pillClass: 'border-primary bg-primary/20',
    color: Theme.colors.foreground,
  },
  destructive: {
    pillClass: 'border-destructive bg-destructive/10',
    color: Theme.colors.destructive,
  },
} as const;

type Props = {
  icon: LucideIcon;
  label: string;
  accessibilityLabel: string;
  variant: keyof typeof PILL_VARIANTS;
  iconFill?: boolean;
  onPress: () => void;
};

function HeaderActionPill({
  icon: Icon,
  label,
  accessibilityLabel,
  variant,
  iconFill,
  onPress,
}: Props) {
  const { pillClass, color } = PILL_VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      hitSlop={isWeb ? 8 : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="h-11 items-end justify-center rounded-full active:opacity-90"
      style={({ pressed }) => [pressed ? { opacity: 0.75 } : null]}
    >
      <View
        pointerEvents="none"
        className={cn(
          'h-8 min-w-[76px] flex-row items-center justify-center gap-1 rounded-full border-2 px-2.5',
          pillClass,
        )}
      >
        <Icon size={12} color={color} fill={iconFill ? color : 'none'} strokeWidth={2.25} />
        <Text
          className="text-xs font-semibold"
          style={{ color }}
          numberOfLines={1}
          pointerEvents="none"
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export default HeaderActionPill;
