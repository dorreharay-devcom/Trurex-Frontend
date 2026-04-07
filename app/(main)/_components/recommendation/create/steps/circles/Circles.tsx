import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CREATE_REC_CIRCLES } from '~/constants/recommendation/createCircles';
import { CreateStepTitle } from '../../CreateStepTitle';
import { cn } from '~/utils/general';
import { CircleRow } from './common';

type Props = {
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

export const Circles: React.FC<Props> = ({ selectedIds, onToggle }) => (
  <ScrollView
    className="flex-1"
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
    contentContainerClassName="items-center pb-36"
  >
    <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
      <View className="items-center space-y-2">
        <CreateStepTitle>Choose your circles</CreateStepTitle>
        <Text className="text-center text-sm text-muted-foreground">
          Pick who sees this recommendation
        </Text>
      </View>

      <View className="gap-2">
        {CREATE_REC_CIRCLES.map((c) => (
          <CircleRow
            key={c.id}
            circle={c}
            selected={selectedIds.has(c.id)}
            onToggle={() => onToggle(c.id)}
          />
        ))}
      </View>
    </View>
  </ScrollView>
);
