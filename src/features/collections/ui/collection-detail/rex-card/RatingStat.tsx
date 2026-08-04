import React from 'react';
import { Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

function RatingStat({ rating }: { rating: number | null | undefined }) {
  if (!rating) return null;

  return (
    <View className="flex-row items-center gap-0.5">
      <Star size={10} color={Theme.colors.ratingStar} fill={Theme.colors.ratingStar} />
      <Text className="text-[11px] text-muted-foreground">{rating}</Text>
    </View>
  );
}

export default RatingStat;
