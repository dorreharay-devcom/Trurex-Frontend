import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Plus } from 'lucide-react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../../../CreateStepTitle';
import { Theme } from '~/theme/Theme';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import type { CreateRecSearchPlace } from '~/types/recommendation/create';
import { cn } from '~/utils/general';
import { SearchPlaceRow } from './SearchPlaceRow';
import { SearchQueryField } from './SearchQueryField';

const SCROLL_PAD = 'pb-36';

type Props = {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedSearchPlace: CreateRecSearchPlace | null;
  onSelectPlace: (place: CreateRecSearchPlace) => void;
  results: CreateRecSearchPlace[];
  showNoResults: boolean;
  isSearching: boolean;
  canSearch: boolean;
  searchErrorMessage: string | null;
  onOpenManual: () => void;
};

export function SearchSelectPanel({
  searchQuery,
  onSearchQueryChange,
  selectedSearchPlace,
  onSelectPlace,
  results,
  showNoResults,
  isSearching,
  canSearch,
  searchErrorMessage,
  onOpenManual,
}: Props) {
  const { data: categoryRows } = useActiveCategories(true);

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName={cn('items-center', SCROLL_PAD)}
    >
      <View className={CREATE_REC_STEP_INNER}>
        <View className="items-center space-y-2 px-1 pb-2">
          <CreateStepTitle>What are you recommending?</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Search for a place, person, or service
          </Text>
        </View>

        <SearchQueryField value={searchQuery} onChangeText={onSearchQueryChange} />

        {searchErrorMessage ? (
          <Text className="py-4 text-center text-sm text-destructive">{searchErrorMessage}</Text>
        ) : null}

        {canSearch && isSearching ? (
          <View className="items-center py-8">
            <ActivityIndicator color={Theme.colors.primary} />
          </View>
        ) : null}

        {canSearch && !isSearching && showNoResults && (
          <Text className="py-6 text-center text-sm text-muted-foreground">No results found</Text>
        )}

        {canSearch &&
          !isSearching &&
          !showNoResults &&
          results.map((place) => (
            <SearchPlaceRow
              key={place.id}
              place={place}
              categoryRows={categoryRows}
              selected={selectedSearchPlace?.id === place.id}
              onSelect={onSelectPlace}
            />
          ))}

        <Pressable
          onPress={onOpenManual}
          className="mt-2 w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-transparent p-4 active:border-primary/40 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Add a new place manually"
        >
          <Plus size={20} color={Theme.colors.secondaryText} />
          <Text className="text-base font-medium text-muted-foreground">
            Add a new place manually
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
