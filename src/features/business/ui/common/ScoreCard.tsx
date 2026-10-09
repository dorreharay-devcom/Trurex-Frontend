import React from 'react';
import { Text, View } from 'react-native';
import { Star, Users } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  icon: 'score' | 'network';
  score: number;
  label: string;
  caption: string;
};

function ScoreCard({ icon, score, label, caption }: Props) {
  const Icon = icon === 'network' ? Users : Star;

  return (
    <View className="flex-1 gap-1 rounded-xl border border-border bg-card p-3">
      <View className="flex-row items-center gap-1.5">
        <Icon
          size={16}
          color={icon === 'network' ? Theme.colors.secondaryText : Theme.colors.ratingStar}
          fill={icon === 'network' ? 'transparent' : Theme.colors.ratingStar}
        />
        <Text className="text-lg font-bold text-foreground">{score.toFixed(1)} / 5</Text>
      </View>
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <Text className="text-xs text-muted-foreground">{caption}</Text>
    </View>
  );
}

export default ScoreCard;
