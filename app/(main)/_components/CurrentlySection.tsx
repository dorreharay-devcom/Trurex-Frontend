import React from 'react';
import { View, Text } from 'react-native';
import type { ProfileData } from '~/types/profile';

interface CurrentlySectionProps {
  currently?: ProfileData['currently'];
}

const ITEMS = [
  { key: 'binging' as const, emoji: '🎬', label: 'Binging' },
  { key: 'listening' as const, emoji: '🎵', label: 'Listening to' },
  { key: 'reading' as const, emoji: '📖', label: 'Reading' },
];

const CurrentlySection = ({ currently }: CurrentlySectionProps) => {
  const active = ITEMS.filter((item) => currently?.[item.key]);
  if (!currently || active.length === 0) return null;

  return (
    <View className="px-4 py-3 border-b border-border gap-2">
      <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        Currently...
      </Text>
      {active.map((item) => (
        <View key={item.key} className="flex-row items-center gap-2">
          <Text className="text-sm">{item.emoji}</Text>
          <Text className="text-xs text-muted-foreground">{item.label}:</Text>
          <Text className="text-xs text-foreground font-medium flex-1" numberOfLines={1}>
            {currently[item.key]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default CurrentlySection;
