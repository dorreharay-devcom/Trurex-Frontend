import React from 'react';
import { View, Text } from 'react-native';
import type { ProfileData } from '~/types/profile';

interface CurrentlySectionProps {
  currently?: ProfileData['currently'];
}

const ITEMS = [
  { key: 'binging' as const, emoji: '🎬', label: 'Currently Binging' },
  { key: 'listening' as const, emoji: '🎵', label: 'Currently Listening to' },
  { key: 'reading' as const, emoji: '📖', label: 'Currently Reading' },
];

const CurrentlySection = ({ currently }: CurrentlySectionProps) => {
  const active = ITEMS.filter((item) => currently?.[item.key]);
  if (!currently || active.length === 0) return null;

  return (
    <View className="px-4 pt-5 pb-3 gap-2">
      <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
        Currently...
      </Text>
      {active.map((item) => (
        <View
          key={item.key}
          className="flex-row items-center gap-3 p-3 rounded-xl bg-background border border-border"
        >
          <Text className="text-xl">{item.emoji}</Text>
          <View className="flex-1">
            <Text className="text-[11px] text-muted-foreground mb-0.5">{item.label}</Text>
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
