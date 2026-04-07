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
    <View>
      <Text className="text-[10px] font-normal uppercase tracking-wide text-foreground">
        What applies?
      </Text>
      <View className="mt-2 flex-row flex-wrap gap-2">
        {CREATE_REC_SCORE_CHIPS.map((chip) => {
          const on = appliesSelected[chip] === true;
          return (
            <Pressable
              key={chip}
              onPress={() => onToggleApplies(chip)}
              className={cn(
                'rounded-[12px] border px-3 py-2 active:opacity-90',
                on ? 'border-primary bg-primary' : 'border-border bg-muted/50',
              )}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text
                className={cn(
                  'text-xs font-normal',
                  on ? 'text-primary-foreground' : 'text-foreground',
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
