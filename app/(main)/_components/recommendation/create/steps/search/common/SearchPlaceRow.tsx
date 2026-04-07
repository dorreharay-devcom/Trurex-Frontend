import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { getRexCategoryById } from '~/constants/recommendation/rexCategories';
import { Theme } from '~/theme/Theme';
import type { CreateRecSearchPlace } from '~/types/recommendation/create';
import { cn } from '~/utils/general';

type Props = {
  place: CreateRecSearchPlace;
  selected: boolean;
  onSelect: (place: CreateRecSearchPlace) => void;
};

export function SearchPlaceRow({ place, selected, onSelect }: Props) {
  const cat = getRexCategoryById(place.categoryId);
  const categoryLabel = cat?.label ?? place.categoryLabel;
  const categoryEmoji = cat?.emoji ?? '📍';
  const categoryLine = `${categoryEmoji}\u00A0${categoryLabel}`;

  return (
    <Pressable
      onPress={() => onSelect(place)}
      className={cn(
        'mb-3 w-full flex-row items-start gap-3 rounded-xl border p-4 text-left bg-card transition-all duration-150',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/40 hover:bg-primary/5 active:border-primary/40 active:bg-primary/5',
      )}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <MapPin size={18} color={Theme.colors.secondaryText} style={{ marginTop: 2 }} />
      <View className="min-w-0 flex-1">
        <Text className="text-base font-semibold text-foreground">{place.title}</Text>
        <Text className="text-sm text-muted mt-0.5">{place.subtitle}</Text>
        <Text className="text-xs text-primary mt-1">{categoryLine}</Text>
      </View>
    </Pressable>
  );
}
