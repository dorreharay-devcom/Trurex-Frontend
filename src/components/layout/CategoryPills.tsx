import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { categoryPillActiveSurface } from '~/utils/recommendation/recCategoryNav';

export interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

interface CategoryPillsProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, activeCategory, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerClassName="gap-2.5 py-2"
  >
    {categories.map((cat) => {
      const active = activeCategory === cat.id;
      return (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          className="items-center min-w-[64px] px-3 py-2.5 rounded-2xl border"
          style={
            active
              ? categoryPillActiveSurface(cat.color)
              : { backgroundColor: 'transparent', borderColor: Theme.colors.border }
          }
        >
          <Text className="text-xl leading-none">{cat.emoji}</Text>
          <Text
            className="text-[10px] font-semibold tracking-wide mt-1"
            style={{ color: active ? cat.color : Theme.colors.foreground }}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

export default CategoryPills;
