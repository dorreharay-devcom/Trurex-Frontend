import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Star } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import PinnedCategoryPill from '~/features/discover/ui/categories/PinnedCategoryPill';
import type { Category } from '~/features/discover/types';

type PinnedCategoriesRowProps = {
  cats: Category[];
  activeCategory: readonly string[];
  onSelectCategory: (code: string) => void;
  onUnpin: (serverId: string) => void;
};

const PinnedCategoriesRow = ({
  cats,
  activeCategory,
  onSelectCategory,
  onUnpin,
}: PinnedCategoriesRowProps) => {
  const [editing, setEditing] = useState(false);

  const handlePress = (cat: Category) => {
    if (!editing) {
      onSelectCategory(cat.code);
      return;
    }
    if (cat.serverId) {
      onUnpin(cat.serverId);
    }
  };

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Star size={14} color={Theme.colors.primary} fill={Theme.colors.primary} />
          <Text className="text-sm font-display font-semibold text-foreground">
            Your Categories
          </Text>
        </View>
        <TouchableOpacity onPress={() => setEditing((v) => !v)} activeOpacity={0.7}>
          <Text className="text-xs text-muted-foreground">{editing ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row flex-nowrap gap-2 pb-1">
          {cats.map((cat) => (
            <PinnedCategoryPill
              key={cat.id}
              cat={cat}
              isActive={activeCategory.includes(cat.code) && !editing}
              editing={editing}
              onPress={() => handlePress(cat)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PinnedCategoriesRow;
