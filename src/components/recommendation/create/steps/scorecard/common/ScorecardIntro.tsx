import React from 'react';
import { View, Text } from 'react-native';
import { CreateStepTitle } from '../../../CreateStepTitle';

type Props = {
  categoryEmoji: string;
  filledCount: number;
  totalSlots: number;
};

export function ScorecardIntro({ categoryEmoji, filledCount, totalSlots }: Props) {
  return (
    <View className="items-center space-y-2">
      <CreateStepTitle>{categoryEmoji} Rate your experience</CreateStepTitle>
      <Text className="text-center text-sm text-muted-foreground">
        All fields are optional — share as much or as little as you like
      </Text>

      <View className="mt-2 items-center justify-center">
        <View className="rounded-full bg-muted px-3 py-1.5">
          <Text className="text-xs font-medium text-foreground">
            {filledCount} of {totalSlots} ratings filled
          </Text>
        </View>
      </View>
    </View>
  );
}
