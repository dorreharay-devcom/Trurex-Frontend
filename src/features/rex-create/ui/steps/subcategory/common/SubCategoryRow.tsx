import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { RexSubcategoryOption } from '~/features/rex-create/lib/categories';
import { CATEGORY_ICON_FALLBACK } from '~/shared/api/categories';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

function pluralCount(count: number, noun: string): string | null {
  if (count <= 0) return null;
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function metaLabelFor(option: RexSubcategoryOption): string {
  return [
    pluralCount(option.ratingCount, 'specific rating'),
    pluralCount(option.questionCount, 'question'),
  ]
    .filter((part): part is string => part != null)
    .join(' + ');
}

type Props = {
  option: RexSubcategoryOption;
  selected: boolean;
  onSelect: (code: string) => void;
};

function SubCategoryRow({ option, selected, onSelect }: Props) {
  const metaLabel = metaLabelFor(option);
  return (
    <Pressable
      onPress={() => onSelect(option.code)}
      className={cn(
        'w-full flex-row items-center gap-3 rounded-xl border-2 p-4 active:opacity-95',
        selected
          ? 'border-primary bg-primary/15'
          : 'border-border bg-card active:border-primary/30',
      )}
    >
      <View className="h-8 w-7 shrink-0 items-center justify-center">
        <Text className="text-2xl leading-none" style={isWeb ? undefined : { lineHeight: 30 }}>
          {option.icon ?? CATEGORY_ICON_FALLBACK}
        </Text>
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className={cn(
            'text-sm font-semibold',
            selected ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {option.label}
        </Text>
        {metaLabel ? (
          <Text className="mt-0.5 text-xs text-muted-foreground">{metaLabel}</Text>
        ) : null}
      </View>
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-full border-2',
          selected ? 'border-primary bg-primary' : 'border-border bg-transparent',
        )}
      >
        {selected ? <View className="h-2 w-2 rounded-full bg-primary-foreground" /> : null}
      </View>
    </Pressable>
  );
}

export default SubCategoryRow;
