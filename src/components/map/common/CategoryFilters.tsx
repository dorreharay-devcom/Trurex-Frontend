import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { MAP_FILTER_CATEGORIES } from '~/constants/map/mapUi';

type Props = {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
};

export const CategoryFilters: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => (
  <View className="mb-4">
    <View className="flex-row flex-wrap gap-2 pb-1">
      <Pressable
        onPress={() => onSelectCategory('all')}
        className={`px-3 py-1.5 rounded-xl border ${
          selectedCategory === 'all'
            ? 'bg-primary border-primary'
            : 'bg-card border-border active:opacity-80'
        }`}
      >
        <Text
          className={`text-xs font-medium ${
            selectedCategory === 'all' ? 'text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          All
        </Text>
      </Pressable>
      {MAP_FILTER_CATEGORIES.map((cat) => {
        const selected = selectedCategory === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelectCategory(selected ? 'all' : cat.id)}
            className="px-3 py-1.5 rounded-xl border flex-row items-center gap-1.5 active:opacity-90"
            style={{
              backgroundColor: selected ? `${cat.color}26` : Theme.colors.card,
              borderColor: selected ? `${cat.color}66` : Theme.colors.border,
            }}
          >
            <Text className="text-xs">{cat.emoji}</Text>
            <Text
              className="text-xs font-medium"
              style={{ color: selected ? cat.color : Theme.colors.secondaryText }}
            >
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);
