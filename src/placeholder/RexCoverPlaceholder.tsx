import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { cn } from '~/utils/general';
import {
  resolveRexCoverPlaceholderRow,
  type RexCoverPlaceholderFooter,
} from './rexCoverPlaceholderData';
import { REX_COVER_PLACEHOLDER_ART_XML } from './rexCoverPlaceholderArtXml';

const FOOTER_GRADIENT: Record<RexCoverPlaceholderFooter, readonly [string, string]> = {
  dark: ['transparent', 'rgba(0,0,0,0.85)'],
  cream: ['transparent', 'rgba(239,237,226,0.95)'],
  slate: ['transparent', 'rgba(183,199,207,0.95)'],
};

type Props = {
  categoryId?: string | null;
  categoryLabel?: string | null;
  className?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function RexCoverPlaceholder({
  categoryId,
  categoryLabel,
  className,
  style,
  accessibilityLabel,
}: Props) {
  const row = resolveRexCoverPlaceholderRow(categoryId);
  const title = categoryLabel?.trim() || row.displayLabel;
  const art =
    REX_COVER_PLACEHOLDER_ART_XML[row.artIndex % REX_COVER_PLACEHOLDER_ART_XML.length] ??
    REX_COVER_PLACEHOLDER_ART_XML[0];
  const gradient = FOOTER_GRADIENT[row.footer];

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      className={cn('relative overflow-hidden', className)}
      style={[{ backgroundColor: row.backgroundColor }, style]}
    >
      <View className="absolute inset-0" pointerEvents="none">
        <SvgXml xml={art} width="100%" height="100%" />
      </View>
      <LinearGradient
        colors={[gradient[0], gradient[1]]}
        locations={[0, 1]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 72,
        }}
        pointerEvents="none"
      />
      <View className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-6" pointerEvents="none">
        <Text
          className="text-[9px] font-semibold uppercase"
          style={{ color: row.titleColor, marginBottom: 3, letterSpacing: 1 }}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="text-[10px] leading-snug" style={{ color: row.subtitleColor }}>
          An absolute gem{'\n'}of a Rex
        </Text>
      </View>
    </View>
  );
}
