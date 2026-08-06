import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CategoryPinButton from '~/features/discover/ui/categories/CategoryPinButton';
import type { Category } from '~/features/discover/types';
import { buttonA11y } from '~/shared/lib/a11y';

type CategoryGridItemProps = {
  cat: Category;
  isActive: boolean;
  pinned: boolean;
  pinDisabled: boolean;
  itemPct: `${number}%`;
  onSelect: (code: string) => void;
  onTogglePin: (serverId: string, pinned: boolean) => void;
};

const CategoryGridItem = ({
  cat,
  isActive,
  pinned,
  pinDisabled,
  itemPct,
  onSelect,
  onTogglePin,
}: CategoryGridItemProps) => {
  const handleTogglePin = () => {
    if (cat.serverId) onTogglePin(cat.serverId, pinned);
  };

  return (
    <View className="relative" style={{ width: itemPct, padding: 6 }}>
      <TouchableOpacity
        onPress={() => onSelect(cat.code)}
        activeOpacity={0.8}
        style={{ width: '100%', height: 74 }}
        className={`flex-col items-center justify-center gap-1 rounded-2xl border-2 ${
          isActive ? 'border-primary bg-primary/15' : 'border-border bg-card'
        }`}
        {...buttonA11y(cat.label, { selected: isActive })}
      >
        <Text style={{ fontSize: 24 }} accessible={false}>
          {cat.emoji}
        </Text>
        <Text
          numberOfLines={2}
          className={`text-[10px] font-medium tracking-tight text-center leading-tight px-1 ${
            isActive ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {cat.label}
        </Text>
      </TouchableOpacity>
      <CategoryPinButton isPinned={pinned} disabled={pinDisabled} onPress={handleTogglePin} />
    </View>
  );
};

export default CategoryGridItem;
