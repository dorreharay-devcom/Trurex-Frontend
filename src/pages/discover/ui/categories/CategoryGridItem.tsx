import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CategoryPinButton from '~/pages/discover/ui/categories/CategoryPinButton';
import type { Category } from '~/pages/discover/types';

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
        className={`flex-col items-center justify-center gap-1 rounded-2xl border ${
          isActive ? 'bg-primary/10 border-primary/40' : 'bg-white border-gray-200'
        }`}
      >
        <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
        <Text
          numberOfLines={2}
          className={`text-[10px] font-bold tracking-tight text-center leading-tight px-1 ${
            isActive ? 'text-primary' : 'text-gray-700'
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
