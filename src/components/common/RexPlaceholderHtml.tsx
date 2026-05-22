import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { cn } from '~/utils/general';
import type { RexPlaceholderFit } from '~/components/common/rexPlaceholderFit';
import { REX_PLACEHOLDER_IMAGE_SOURCE } from '~/constants/rexPlaceholderPhoto';

type Props = {
  html: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  fit?: RexPlaceholderFit;
};

export function RexPlaceholderHtml({ className, style, fit = 'cover' }: Props) {
  return (
    <View className={cn('absolute inset-0 overflow-hidden bg-muted', className)} style={style}>
      <Image
        source={REX_PLACEHOLDER_IMAGE_SOURCE}
        className="h-full w-full"
        style={{ width: '100%', height: '100%' }}
        contentFit={fit}
      />
    </View>
  );
}
