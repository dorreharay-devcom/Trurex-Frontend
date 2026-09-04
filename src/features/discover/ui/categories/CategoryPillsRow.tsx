import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { Category } from '~/features/discover/types';

type CategoryPillsRowProps = {
  cats: Category[];
  activeCategory: readonly string[];
  onSelectCategory: (code: string) => void;
};

const CategoryPillsRow = ({ cats, activeCategory, onSelectCategory }: CategoryPillsRowProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row flex-nowrap gap-2 pb-1">
        {cats.map((cat) => {
          const isActive = activeCategory.includes(cat.code);
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.code)}
              activeOpacity={0.8}
              className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border-2 ${
                isActive ? 'border-primary bg-primary/15' : 'border-border bg-card'
              }`}
            >
              <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
              <Text
                className={`text-[10px] font-medium whitespace-nowrap ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default CategoryPillsRow;
