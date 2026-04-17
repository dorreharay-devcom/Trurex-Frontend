import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '~/utils/general';

const VALUE_LABELS_RIP_OFF = [
  'Total Rip-Off',
  'Poor Value',
  'Fair',
  'Good Value',
  'Exceptional Value',
] as const;

const VALUE_LABELS_DEFAULT = [
  'Total Steal',
  'Budget-Friendly',
  'Good Value',
  'Worth Every Cent',
  'Splurge',
] as const;

type Props = {
  value: number | null;
  onChange: (v: number | null) => void;
  useRipOffLabels: boolean;
};

export function ScorecardValueForMoney({ value, onChange, useRipOffLabels }: Props) {
  const labels = useRipOffLabels ? VALUE_LABELS_RIP_OFF : VALUE_LABELS_DEFAULT;

  return (
    <View className="space-y-3">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-xs font-medium uppercase tracking-wider text-foreground">
          Value for money
        </Text>
        {value === null ? (
          <Text className="max-w-[55%] shrink text-right text-[10px] italic text-primary/70">
            Help others plan — how was the value?
          </Text>
        ) : null}
      </View>
      <View className="flex-row flex-wrap gap-2">
        {labels.map((label, i) => {
          const val = i + 1;
          const selected = value === val;
          const dollars = '$'.repeat(val);
          return (
            <Pressable
              key={label}
              onPress={() => onChange(selected ? null : val)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Value for money: ${dollars} ${label}`}
              className={cn(
                'rounded-full border px-3 py-2 active:opacity-90',
                selected ? 'border-primary bg-primary' : 'border-border bg-muted/50',
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  selected ? 'text-primary-foreground' : 'text-muted-foreground',
                )}
              >
                {dollars} {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
