import React from 'react';
import { View } from 'react-native';
import { Globe, Heart, Lock, Users } from 'lucide-react-native';
import type { CircleIconKind } from '~/shared/types/circles';
import { cn } from '~/shared/lib/ui/styles';

const GLYPH_ICONS: Record<CircleIconKind, typeof Lock> = {
  lock: Lock,
  heart: Heart,
  users: Users,
  globe: Globe,
};

type Props = {
  iconKind: CircleIconKind;
  color: string;
  size?: number;
  bg?: string;
  large?: boolean;
};

export function CircleGlyph({ iconKind, color, size = 20, bg, large }: Props) {
  const Icon = GLYPH_ICONS[iconKind];
  const icon = <Icon size={size} color={color} />;

  if (!bg) return icon;

  return (
    <View
      className={cn(
        'shrink-0 items-center justify-center rounded-xl',
        large ? 'h-12 w-12' : 'h-11 w-11',
      )}
      style={{ backgroundColor: bg }}
    >
      {icon}
    </View>
  );
}
