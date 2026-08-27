import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';
import type { ThankCopyOption } from '~/features/rex-detail/types/rexDetail';

type Props = {
  options: ThankCopyOption[];
  selected: number | null;
  onSelect: (id: number) => void;
};

function ThankMessageOptionsRadioGroup({ options, selected, onSelect }: Props) {
  return (
    <View className="pb-2">
      {options.map((option) => {
        const active = selected === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            className="mb-2.5 flex-row items-start gap-3 rounded-lg py-1 active:opacity-90"
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
          >
            <View
              className={cn(
                'mt-0.5 h-4 w-4 items-center justify-center rounded-full border-2',
                active ? 'border-primary bg-primary' : 'border-border',
              )}
            >
              {active ? <View className="h-1.5 w-1.5 rounded-full bg-primary-foreground" /> : null}
            </View>
            <Text className="min-w-0 flex-1 text-sm leading-5 text-foreground">
              {option.message}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default ThankMessageOptionsRadioGroup;
