import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { Category } from '~/features/discover/types';

type PinnedCategoryPillProps = {
  cat: Category;
  isActive: boolean;
  editing: boolean;
  onPress: () => void;
};

const PinnedCategoryPill = ({ cat, isActive, editing, onPress }: PinnedCategoryPillProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl border ${isActive ? 'border-primary/40 bg-primary/10' : 'bg-card border-border'}`}
    >
      <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
      <Text
        className={`text-xs font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        {cat.label}
      </Text>
      {editing && <Text className="ml-1 text-destructive font-bold">×</Text>}
    </TouchableOpacity>
  );
};

export default PinnedCategoryPill;
