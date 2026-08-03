import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';

const CATEGORY_TAGS = [
  'Food & Drink',
  'Experiences',
  'Travel',
  'Outdoors',
  'Culture',
  'Shopping',
  'Services',
  'Mixed',
];

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

function CategoryTagPicker({ value, onChange }: Props) {
  return (
    <View>
      <Text className="mb-1.5 text-xs font-semibold text-muted-foreground">
        Category tag (optional)
      </Text>
      <View className="flex-row flex-wrap gap-1.5">
        {CATEGORY_TAGS.map((tag) => {
          const on = value === tag;
          return (
            <Pressable
              key={tag}
              onPress={() => onChange(on ? null : tag)}
              className={cn(
                'rounded-full border px-3 py-1.5 active:opacity-90',
                on ? 'border-primary bg-primary' : 'border-border bg-muted/50',
              )}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text
                className={cn(
                  'text-xs font-medium',
                  on ? 'text-primary-foreground' : 'text-foreground',
                )}
              >
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default CategoryTagPicker;
