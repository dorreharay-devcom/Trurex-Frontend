import React from 'react';
import { View, Text } from 'react-native';
import { CreateStepTitle } from '../../../CreateStepTitle';

type Props = {
  categoryEmoji: string;
  typeStepDisplayName: string | null;
  filledCount: number;
  totalSlots: number;
};

export function ScorecardIntro({
  categoryEmoji,
  typeStepDisplayName,
  filledCount,
  totalSlots,
}: Props) {
  const typeTrimmed = typeStepDisplayName?.trim() ?? '';

  return (
    <View className="items-center space-y-2">
      <CreateStepTitle>{categoryEmoji} Rate your experience</CreateStepTitle>
      {typeTrimmed.length > 0 ? (
        <Text className="text-center text-sm font-medium text-primary">{typeTrimmed}</Text>
      ) : null}
      <Text className="text-center text-sm text-muted-foreground">
        All fields are optional — share as much or as little as you like
      </Text>

      <View className="mt-2 items-center justify-center">
        <View className="rounded-full border border-border bg-muted/50 px-3 py-2">
          <Text className="text-xs font-medium text-black">
            {filledCount} of {totalSlots} ratings filled
          </Text>
        </View>
      </View>
    </View>
  );
}
