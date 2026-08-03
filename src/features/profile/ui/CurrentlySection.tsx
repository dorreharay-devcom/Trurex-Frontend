import React from 'react';
import { Text, View } from 'react-native';
import { CURRENTLY_FIELDS } from '~/features/profile/config/currently';
import type { ProfileData } from '~/features/profile/types/profile';

type Props = {
  currently?: ProfileData['currently'];
};

const CurrentlySection = ({ currently }: Props) => {
  if (!currently) return null;

  const active = CURRENTLY_FIELDS.filter((item) => currently[item.key]);
  if (active.length === 0) return null;

  return (
    <View className="gap-2 px-4 pb-3 pt-5">
      <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Currently...
      </Text>
      {active.map((item) => (
        <View
          key={item.key}
          className="flex-row items-center gap-3 rounded-xl border border-border bg-background p-3"
        >
          <Text className="text-xl">{item.emoji}</Text>
          <View className="flex-1">
            <Text className="mb-0.5 text-[11px] text-muted-foreground">{item.viewLabel}</Text>
            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
              {currently[item.key]}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default CurrentlySection;
