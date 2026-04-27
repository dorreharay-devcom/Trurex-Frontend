import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export type DiscoverCategoryPillItem = {
  id: string;
  label: string;
  emoji: string;
};

type Props = {
  categories: DiscoverCategoryPillItem[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  maxVisible?: number;
};

const DEFAULT_MAX = 8;

export const DiscoverRemainingCategoryPills = React.memo(function DiscoverRemainingCategoryPills({
  categories,
  activeCategoryId,
  onSelectCategory,
  maxVisible = DEFAULT_MAX,
}: Props) {
  const visible = categories.length <= maxVisible ? categories : categories.slice(0, maxVisible);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 pb-1">
        {visible.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.7}
              className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${
                isActive ? 'border-primary/40 bg-primary/10' : 'bg-card border-border'
              }`}
            >
              <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
              <Text
                className={`text-[10px] font-semibold ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
});
