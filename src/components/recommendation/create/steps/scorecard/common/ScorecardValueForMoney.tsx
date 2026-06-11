import React from 'react';
import { Platform, View, Text, Pressable } from 'react-native';
import { cn } from '~/utils/general';
import { VALUE_FOR_MONEY_LABELS } from '~/utils/recommendation/recContentDisplay';

type Props = {
  value: number | null;
  onChange: (v: number | null) => void;
};

export function ScorecardValueForMoney({ value, onChange }: Props) {
  return (
    <View className="gap-3" style={Platform.OS === 'web' ? undefined : { marginBottom: 8 }}>
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-xs font-medium uppercase tracking-wider text-black">
          Value for money
        </Text>
        {value === null ? (
          <Text className="max-w-[55%] shrink text-right text-[10px] italic text-black opacity-80">
            Help others plan — how was the value?
          </Text>
        ) : null}
      </View>
      <View className="flex-row flex-wrap gap-2">
        {VALUE_FOR_MONEY_LABELS.map((label, i) => {
          const val = i + 1;
          const selected = value === val;
          return (
            <Pressable
              key={label}
              onPress={() => onChange(selected ? null : val)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Value for money: ${label}`}
              className={cn(
                'rounded-full border px-3 py-2 active:opacity-90',
                selected ? 'border-primary bg-primary' : 'border-border bg-muted/50',
              )}
            >
              <Text className={cn('text-sm', selected ? 'text-primary-foreground' : 'text-black')}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
