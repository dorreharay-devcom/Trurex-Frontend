import React, { useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Platform } from 'react-native';
import { MapPin, Plus, Search as SearchIcon } from 'lucide-react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CREATE_REC_SEARCH_PLACES } from '~/constants/recommendation/mockSearchPlaces';
import { CreateStepTitle } from '../CreateStepTitle';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { getRexCategoryById } from '~/constants/recommendation/rexCategories';
import type { CreateRecSearchPlace, SearchEntryMode } from '~/types/recommendation/create';

const webNoOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : undefined;

type Props = {
  mode: SearchEntryMode;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedPlaceId: string | null;
  onSelectPlace: (place: CreateRecSearchPlace) => void;
  manualName: string;
  onManualNameChange: (v: string) => void;
  manualAddress: string;
  onManualAddressChange: (v: string) => void;
  manualGeotag: { lat: number; lng: number } | null;
  onOpenManual: () => void;
  onBackToSearchSelect: () => void;
  onTagLocationPress: () => void;
};

/** Step: find or add what you’re recommending (search list or manual entry). */
export const Search: React.FC<Props> = ({
  mode,
  searchQuery,
  onSearchQueryChange,
  selectedPlaceId,
  onSelectPlace,
  manualName,
  onManualNameChange,
  manualAddress,
  onManualAddressChange,
  manualGeotag,
  onOpenManual,
  onBackToSearchSelect,
  onTagLocationPress,
}) => {
  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return CREATE_REC_SEARCH_PLACES;
    }
    return CREATE_REC_SEARCH_PLACES.filter((p) => {
      const meta = getRexCategoryById(p.categoryId);
      return (
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        (meta?.label.toLowerCase().includes(q) ?? false)
      );
    });
  }, [searchQuery]);

  const hasActiveQuery = searchQuery.trim().length > 0;
  const showNoResults = hasActiveQuery && results.length === 0;
  const scrollPad = 'pb-36';

  if (mode === 'manual') {
    return (
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName={`items-center ${scrollPad}`}
      >
        <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
          <View className="items-center mb-2 px-1">
            <CreateStepTitle>Add a new place</CreateStepTitle>
            <Text className="mt-1.5 text-center text-sm font-normal text-foreground leading-5">
              Enter the name and address manually
            </Text>
          </View>

          <TextInput
            value={manualName}
            onChangeText={onManualNameChange}
            placeholder="Name of place, person, or service"
            placeholderTextColor={Theme.colors.secondaryText}
            className="w-full rounded-[12px] border border-border bg-muted/50 px-4 py-3.5 text-base text-foreground focus:outline-none focus:border-primary"
            style={[webNoOutline, textFieldCaretStyle]}
            autoCorrect
            autoCapitalize="words"
            underlineColorAndroid="transparent"
            selectionColor={Theme.colors.foreground}
          />

          <TextInput
            value={manualAddress}
            onChangeText={onManualAddressChange}
            placeholder="Address or location (optional)"
            placeholderTextColor={Theme.colors.secondaryText}
            className="w-full rounded-[12px] border border-border bg-muted/50 px-4 py-3.5 text-base text-foreground focus:outline-none focus:border-primary"
            style={[webNoOutline, textFieldCaretStyle]}
            autoCorrect
            autoCapitalize="sentences"
            underlineColorAndroid="transparent"
            selectionColor={Theme.colors.foreground}
          />

          <Pressable
            onPress={onTagLocationPress}
            className="w-full flex-row items-center gap-1.5 rounded-lg py-2 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel={manualGeotag ? 'Update geotagged location' : 'Tag current location'}
          >
            <MapPin size={18} color={Theme.colors.primary} />
            <Text
              style={{ color: Theme.colors.primary }}
              className="text-sm font-normal underline-offset-2 decoration-primary hover:underline active:underline"
            >
              {manualGeotag
                ? `Geotagged (${manualGeotag.lat.toFixed(4)}, ${manualGeotag.lng.toFixed(4)})`
                : 'Tag current location'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onBackToSearchSelect}
            className="group -mx-1 self-start rounded-lg px-1 py-2"
            accessibilityRole="button"
            accessibilityLabel="Back to search"
          >
            <View className="flex-row items-center">
              <Text className="text-sm text-foreground group-hover:text-primary group-active:text-primary">
                ←{' '}
              </Text>
              <Text className="text-sm text-foreground underline-offset-2 decoration-primary group-hover:text-primary group-hover:underline group-active:text-primary group-active:underline">
                Back to search
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName={`items-center ${scrollPad}`}
    >
      <View className={CREATE_REC_STEP_INNER}>
        <View className="items-center mb-5 px-1">
          <CreateStepTitle>What are you recommending?</CreateStepTitle>
          <Text className="mt-1.5 text-center text-sm font-normal text-foreground leading-5">
            Search for a place, person, or service
          </Text>
        </View>

        <View className="relative mb-4 w-full">
          <View className="pointer-events-none absolute left-4 top-0 bottom-0 z-10 justify-center">
            <SearchIcon size={18} color={Theme.colors.secondaryText} />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            placeholder="Search by name..."
            placeholderTextColor={Theme.colors.secondaryText}
            className="w-full rounded-xl border border-border bg-muted/50 py-3.5 pl-11 pr-4 text-base text-foreground transition focus:outline-none focus:border-primary"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            underlineColorAndroid="transparent"
            selectionColor={Theme.colors.foreground}
            style={[webNoOutline, textFieldCaretStyle]}
          />
        </View>

        {showNoResults && (
          <Text className="py-6 text-sm text-foreground text-center">No results found</Text>
        )}

        {!showNoResults &&
          results.map((place) => {
            const selected = selectedPlaceId === place.id;
            const cat = getRexCategoryById(place.categoryId);
            const categoryLabel = cat?.label ?? place.categoryLabel;
            const categoryEmoji = cat?.emoji ?? '📍';
            const categoryLine = `${categoryEmoji}\u00A0${categoryLabel}`;
            return (
              <Pressable
                key={place.id}
                onPress={() => onSelectPlace(place)}
                className={`mb-3 w-full flex-row items-start gap-3 rounded-xl border p-4 text-left bg-card transition-all duration-150 ${
                  selected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40 hover:bg-primary/5 active:border-primary/40 active:bg-primary/5'
                }`}
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
          })}

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
};
