import React from 'react';
import { Globe, Heart, Lock, Users } from 'lucide-react-native';
import type {
  CreateRecCircle,
  CreateRecCircleIconKind,
} from '~/constants/recommendation/createCircles';

const GLYPH_ICONS: Record<CreateRecCircleIconKind, typeof Lock> = {
  lock: Lock,
  heart: Heart,
  users: Users,
  globe: Globe,
};

type Props = {
  circle: CreateRecCircle;
  size: number;
};

function CircleGlyph({ circle, size }: Props) {
  const Icon = GLYPH_ICONS[circle.iconKind];
  return <Icon size={size} color={circle.accent} />;
}

export default CircleGlyph;
