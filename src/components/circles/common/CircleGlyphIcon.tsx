import React from 'react';
import { View } from 'react-native';
import { Globe, Heart, Lock, Users } from 'lucide-react-native';
import type { CircleTabIconKind } from '~/shared/lib/recCircles';

const GLYPH_ICONS: Record<CircleTabIconKind, typeof Lock> = {
  lock: Lock,
  heart: Heart,
  users: Users,
  globe: Globe,
};

type Props = {
  iconKind: CircleTabIconKind;
  color: string;
  bg: string;
  size?: number;
  large?: boolean;
};

export function CircleGlyphIcon({ iconKind, color, bg, size = 20, large }: Props) {
  const Icon = GLYPH_ICONS[iconKind];
  return (
    <View
      className={`${large ? 'h-12 w-12' : 'h-11 w-11'} shrink-0 items-center justify-center rounded-xl`}
      style={{ backgroundColor: bg }}
    >
      <Icon size={size} color={color} />
    </View>
  );
}
