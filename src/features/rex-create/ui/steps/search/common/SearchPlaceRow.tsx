import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin } from 'lucide-react-native';
import {
  CATEGORY_ICON_FALLBACK,
  resolveCategoryIconFromRows,
  type DbCategoryRow,
} from '~/shared/api/categories';
import { Theme } from '~/shared/theme/Theme';
import type { CreateRecSearchPlace } from '~/features/rex-create/types/create';
import { cn } from '~/utils/general';
import { isStrictUuid } from '~/utils/guards';

type Props = {
  place: CreateRecSearchPlace;
  categoryRows: DbCategoryRow[] | undefined;
  selected: boolean;
  onSelect: (place: CreateRecSearchPlace) => void;
};

function categoryEmojiForPlace(
  place: CreateRecSearchPlace,
  categoryRows: DbCategoryRow[] | undefined,
): string {
  const fromApi = place.categoryIcon?.trim();
  if (fromApi) return fromApi;
  const code = place.categoryCode?.trim();
  if (code) return resolveCategoryIconFromRows(code, categoryRows);
  const legacyId = place.categoryId?.trim();
  if (legacyId && !isStrictUuid(legacyId))
    return resolveCategoryIconFromRows(legacyId, categoryRows);
  return CATEGORY_ICON_FALLBACK;
}

function SearchPlaceRow({ place, categoryRows, selected, onSelect }: Props) {
  const categoryLine = `${categoryEmojiForPlace(place, categoryRows)}\u00A0${place.categoryLabel}`;

  return (
    <Pressable
      onPress={() => onSelect(place)}
      className={cn(
        'mb-2 w-full flex-row items-start gap-3 rounded-xl border-2 border-border bg-card p-4 text-left',
        selected ? 'border-primary bg-primary/15' : 'active:border-primary/40 active:bg-primary/5',
      )}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <MapPin size={20} color={Theme.colors.secondaryText} style={{ marginTop: 2 }} />
      <View className="min-w-0 flex-1">
        <Text className="text-base font-semibold text-foreground">{place.title}</Text>
        <Text className="mt-0.5 text-sm text-muted-foreground">{place.subtitle}</Text>
        <Text className="mt-1 text-xs text-muted-foreground">{categoryLine}</Text>
      </View>
    </Pressable>
  );
}

export default SearchPlaceRow;
