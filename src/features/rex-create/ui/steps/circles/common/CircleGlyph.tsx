import React from 'react';
import { Globe, Heart, Lock, Users } from 'lucide-react-native';
import type { CircleDisplayRow, CircleIconKind } from '~/shared/types/circles';

const GLYPH_ICONS: Record<CircleIconKind, typeof Lock> = {
  lock: Lock,
  heart: Heart,
  users: Users,
  globe: Globe,
};

type Props = {
  circle: CircleDisplayRow;
  size: number;
};

function CircleGlyph({ circle, size }: Props) {
  const Icon = GLYPH_ICONS[circle.iconKind];
  return <Icon size={size} color={circle.accent} />;
}

export default CircleGlyph;
