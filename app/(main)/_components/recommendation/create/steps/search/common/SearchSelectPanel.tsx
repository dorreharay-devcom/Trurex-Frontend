import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../../../CreateStepTitle';
import { Theme } from '~/theme/Theme';
import type { CreateRecSearchPlace } from '~/types/recommendation/create';
import { cn } from '~/utils/general';
import { SearchPlaceRow } from './SearchPlaceRow';
import { SearchQueryField } from './SearchQueryField';

const SCROLL_PAD = 'pb-36';

type Props = {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedPlaceId: string | null;
  onSelectPlace: (place: CreateRecSearchPlace) => void;
  results: CreateRecSearchPlace[];
  showNoResults: boolean;
  onOpenManual: () => void;
};

export function SearchSelectPanel({
  searchQuery,
  onSearchQueryChange,
  selectedPlaceId,
  onSelectPlace,
  results,
  showNoResults,
  onOpenManual,
}: Props) {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName={cn('items-center', SCROLL_PAD)}
    >
      <View className={CREATE_REC_STEP_INNER}>
        <View className="items-center mb-5 px-1">
          <CreateStepTitle>What are you recommending?</CreateStepTitle>
          <Text className="mt-1.5 text-center text-sm font-normal text-foreground leading-5">
            Search for a place, person, or service
          </Text>
        </View>

        <SearchQueryField value={searchQuery} onChangeText={onSearchQueryChange} />

        {showNoResults && (
          <Text className="py-6 text-sm text-foreground text-center">No results found</Text>
        )}

        {!showNoResults &&
          results.map((place) => (
            <SearchPlaceRow
              key={place.id}
              place={place}
              selected={selectedPlaceId === place.id}
              onSelect={onSelectPlace}
            />
          ))}

        <Pressable
          onPress={onOpenManual}
          className="group mt-1 mb-2 w-full flex-row items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-transparent p-4 transition-colors hover:border-primary/40 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Add a new place manually"
        >
          <Plus size={16} color={Theme.colors.foreground} />
          <Text className="text-sm text-foreground">Add a new place manually</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
