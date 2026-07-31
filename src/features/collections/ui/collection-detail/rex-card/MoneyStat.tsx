import React from 'react';
import { Text, View } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { valueForMoneyLabel } from '~/shared/lib/valueForMoney';

function MoneyStat({ score }: { score: number | null | undefined }) {
  if (!score) return null;

  return (
    <View className="flex-row items-center gap-0.5">
      <DollarSign size={10} color={Theme.colors.muted} />
      <Text className="text-[11px] text-muted-foreground">{valueForMoneyLabel(score)}</Text>
    </View>
  );
}

export default MoneyStat;
