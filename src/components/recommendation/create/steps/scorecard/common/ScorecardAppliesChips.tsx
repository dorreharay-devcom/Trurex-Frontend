import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CREATE_REC_SCORE_CHIPS } from '~/constants/recommendation/createScorecard';
import { cn } from '~/utils/general';

type Props = {
  appliesSelected: Record<string, boolean>;
  onToggleApplies: (label: string) => void;
};

export function ScorecardAppliesChips({ appliesSelected, onToggleApplies }: Props) {
  return (
    <View className="space-y-3">
      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        What applies?
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {CREATE_REC_SCORE_CHIPS.map((chip) => {
          const on = appliesSelected[chip] === true;
          return (
            <Pressable
              key={chip}
              onPress={() => onToggleApplies(chip)}
              className={cn(
                'rounded-full border px-3 py-1.5 active:opacity-90',
                on ? 'border-primary bg-primary' : 'border-border bg-muted/50',
              )}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  on ? 'text-primary-foreground' : 'text-muted-foreground',
                )}
              >
                {chip}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
