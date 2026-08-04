import React from 'react';
import { Text, View } from 'react-native';
import { ordinalDegreeLabel } from '~/features/circles/lib/labels';

type Props = { degree: number | null | undefined };

const DegreeBadge = ({ degree }: Props) => {
  if (degree == null || degree < 1) return null;
  return (
    <View className="mt-1.5 self-start rounded-full border border-border bg-card px-2 py-0.5">
      <Text className="text-[11px] font-medium text-muted-foreground">
        {ordinalDegreeLabel(degree)} degree
      </Text>
    </View>
  );
};

export default DegreeBadge;
