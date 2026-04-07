import React from 'react';
import { View, Text } from 'react-native';
import { CREATE_REC_SCORE_COUNT } from '~/constants/recommendation/createScorecard';
import { CreateStepTitle } from '../../../CreateStepTitle';

type Props = {
  categoryEmoji: string;
  filledCount: number;
};

export function ScorecardIntro({ categoryEmoji, filledCount }: Props) {
  return (
    <View>
      <CreateStepTitle>{categoryEmoji} Rate your experience</CreateStepTitle>
      <Text className="mt-1.5 px-1 text-center text-sm font-normal text-foreground leading-5">
        All fields are optional — share as much or as little as you like
      </Text>

      <View className="mt-4 items-center">
        <View className="rounded-full bg-secondary px-3 py-1.5">
          <Text className="text-xs font-normal text-secondary-foreground">
            {filledCount} of {CREATE_REC_SCORE_COUNT} ratings filled
          </Text>
        </View>
      </View>
    </View>
  );
}
