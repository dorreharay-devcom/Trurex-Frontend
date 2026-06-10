import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '~/utils/general';

type Props = {
  categoryIcon?: string | null;
  colors?: string[] | null;
  className?: string;
  style?: StyleProp<ViewStyle>;
  emojiSize?: number;
  accessibilityLabel?: string;
};

const FALLBACK_COLORS = ['#263238', '#111827'] as const;

function normalizeGradientColors(colors?: string[] | null): [string, string, ...string[]] {
  const cleaned = colors?.map((c) => c.trim()).filter(Boolean) ?? [];
  if (cleaned.length >= 2) return cleaned as [string, string, ...string[]];
  if (cleaned.length === 1) return [cleaned[0], cleaned[0]];
  return [...FALLBACK_COLORS];
}

export function RexPhotoPlaceholder({
  categoryIcon,
  colors,
  className,
  style,
  emojiSize = 36,
  accessibilityLabel = 'Rex placeholder',
}: Props) {
  const icon = categoryIcon?.trim() || '✦';
  const gradientColors = normalizeGradientColors(colors);

  return (
    <View
      className={cn('relative overflow-hidden bg-muted', className)}
      style={style}
      accessibilityLabel={accessibilityLabel}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View className="absolute inset-0 items-center justify-center">
        <Text
          style={{
            fontSize: emojiSize,
            lineHeight: Math.ceil(emojiSize * 1.25),
            textShadowColor: 'rgba(0,0,0,0.22)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
          }}
        >
          {icon}
        </Text>
      </View>
    </View>
  );
}
