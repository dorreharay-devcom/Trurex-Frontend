import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { WISH_LIST_TAG_OPTIONS } from '~/features/wish-list/config/tags';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  selected: Set<string>;
  onToggle: (slug: string) => void;
};

function TagPillPicker({ selected, onToggle }: Props) {
  return (
    <View className="space-y-3">
      <Text className="text-xs font-semibold uppercase tracking-wider text-foreground">
        Set the mood
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {WISH_LIST_TAG_OPTIONS.map((tag) => {
          const on = selected.has(tag.slug);
          return (
            <Pressable
              key={tag.slug}
              onPress={() => onToggle(tag.slug)}
              className={cn(
                'rounded-full border px-3 py-1.5 active:opacity-90',
                on ? 'border-primary bg-primary' : 'border-border bg-muted/50',
              )}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text className={cn('text-sm', on ? 'text-primary-foreground' : 'text-foreground')}>
                {tag.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default TagPillPicker;
