import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput, Platform } from 'react-native';
import { Check, Plus, MapPin } from 'lucide-react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../../../CreateStepTitle';
import {
  Theme,
  textFieldCaretStyle,
  textFieldNativeSingleLineNoWrapStyle,
  textFieldSingleLineLargeHeightStyle,
  textFieldSingleLineStyle,
} from '~/theme/Theme';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import type { CreateRecSearchPlace } from '~/types/recommendation/create';
import { cn, webDisabledCursorStyle } from '~/utils/general';
import { SearchPlaceRow } from './SearchPlaceRow';
import { SearchQueryField } from './SearchQueryField';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import { webNoOutline } from './webInputOutline';

const SCROLL_PAD = 'pb-36';

type Props = {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onlineSelected: boolean;
  onOnlineSelectedChange: (selected: boolean) => void;
  onlineName: string;
  onOnlineNameChange: (v: string) => void;
  onlineWebsiteUrl: string;
  onOnlineWebsiteUrlChange: (v: string) => void;
  onlineLocationText: string;
  onOnlineLocationTextChange: (v: string) => void;
  onlineGeotag: { lat: number; lng: number } | null;
  onTagLocationPress: () => void;
  tagLocationLoading: boolean;
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
  onlineSelected,
  onOnlineSelectedChange,
  onlineName,
  onOnlineNameChange,
  onlineWebsiteUrl,
  onOnlineWebsiteUrlChange,
  onlineLocationText,
  onOnlineLocationTextChange,
  onlineGeotag,
  onTagLocationPress,
  tagLocationLoading,
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
  const selectedPlaceAlreadyInResults =
    selectedSearchPlace != null && results.some((place) => place.id === selectedSearchPlace.id);

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
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

        <SearchQueryField
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          editable={!onlineSelected}
        />

        {!onlineSelected && searchErrorMessage ? (
          <Text className="py-4 text-center text-sm text-destructive">{searchErrorMessage}</Text>
        ) : null}

        {onlineSelected ? null : canSearch && isSearching ? (
          <View className="items-center py-8">
            <ActivityIndicator color={Theme.colors.primary} />
          </View>
        ) : null}

        {!onlineSelected && canSearch && !isSearching && showNoResults && !selectedSearchPlace && (
          <Text className="py-6 text-center text-sm text-muted-foreground">No results found</Text>
        )}

        {!onlineSelected &&
          canSearch &&
          !isSearching &&
          selectedSearchPlace &&
          !selectedPlaceAlreadyInResults && (
            <SearchPlaceRow
              place={selectedSearchPlace}
              categoryRows={categoryRows}
              selected
              onSelect={onSelectPlace}
            />
          )}

        {!onlineSelected &&
          canSearch &&
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

        <View
          className={cn('mt-2 w-full', onlineSelected && 'cursor-not-allowed')}
          style={onlineSelected && Platform.OS === 'web' ? webDisabledCursorStyle : undefined}
        >
          <Pressable
            onPress={() => {
              if (onlineSelected) return;
              onOpenManual();
            }}
            disabled={onlineSelected && Platform.OS !== 'web'}
            accessibilityState={{ disabled: onlineSelected }}
            style={onlineSelected && Platform.OS === 'web' ? webDisabledCursorStyle : undefined}
            className={cn(
              'w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-transparent p-4',
              onlineSelected
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer active:border-primary/40 active:opacity-90',
            )}
            accessibilityRole="button"
            accessibilityLabel="Add a new place manually"
          >
            <Plus size={20} color={Theme.colors.secondaryText} />
            <Text className="text-base font-medium text-muted-foreground">
              Add a new place manually
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => onOnlineSelectedChange(!onlineSelected)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: onlineSelected }}
          className="mb-3 mt-6 flex-row items-center gap-2 self-start active:opacity-90"
        >
          <View
            className={cn(
              'h-5 w-5 items-center justify-center rounded border',
              onlineSelected
                ? 'border-primary bg-primary'
                : 'border-muted-foreground bg-transparent',
            )}
          >
            {onlineSelected ? <Check size={13} color={Theme.colors.primaryForeground} /> : null}
          </View>
          <Text className="text-sm text-foreground">
            No fixed address (person, service, or online)
          </Text>
        </Pressable>

        {onlineSelected ? (
          <View className="mb-2 w-full gap-3">
            <TextInput
              value={onlineName}
              onChangeText={onOnlineNameChange}
              placeholder="Name…"
              placeholderTextColor={Theme.colors.secondaryText}
              className={cn(
                'w-full rounded-xl border border-border bg-muted/50 px-4 text-base text-foreground',
                Platform.OS === 'web' ? 'py-3.5' : 'py-0',
                INPUT_FOCUS_RING_CLASS,
              )}
              style={[
                webNoOutline,
                textFieldCaretStyle,
                textFieldSingleLineStyle,
                textFieldSingleLineLargeHeightStyle,
                textFieldNativeSingleLineNoWrapStyle,
              ]}
              autoCorrect
              autoCapitalize="words"
              underlineColorAndroid="transparent"
              selectionColor={Theme.colors.foreground}
              multiline={false}
              numberOfLines={1}
              scrollEnabled={false}
            />
            <TextInput
              value={onlineWebsiteUrl}
              onChangeText={onOnlineWebsiteUrlChange}
              placeholder="Link to site…"
              placeholderTextColor={Theme.colors.secondaryText}
              className={cn(
                'w-full rounded-xl border border-border bg-muted/50 px-4 text-base text-foreground',
                Platform.OS === 'web' ? 'py-3.5' : 'py-0',
                INPUT_FOCUS_RING_CLASS,
              )}
              style={[
                webNoOutline,
                textFieldCaretStyle,
                textFieldSingleLineStyle,
                textFieldSingleLineLargeHeightStyle,
                textFieldNativeSingleLineNoWrapStyle,
              ]}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="url"
              textContentType="URL"
              underlineColorAndroid="transparent"
              selectionColor={Theme.colors.foreground}
              multiline={false}
              numberOfLines={1}
              scrollEnabled={false}
            />
            <TextInput
              value={onlineLocationText}
              onChangeText={onOnlineLocationTextChange}
              placeholder="Address or location"
              placeholderTextColor={Theme.colors.secondaryText}
              editable={Platform.OS === 'android' || !tagLocationLoading}
              className={cn(
                'w-full rounded-xl border border-border bg-muted/50 px-4 text-base text-foreground',
                Platform.OS === 'web' ? 'py-3.5' : 'py-0',
                INPUT_FOCUS_RING_CLASS,
              )}
              style={[
                webNoOutline,
                textFieldCaretStyle,
                textFieldSingleLineStyle,
                textFieldSingleLineLargeHeightStyle,
                textFieldNativeSingleLineNoWrapStyle,
              ]}
              autoCorrect
              autoCapitalize="sentences"
              underlineColorAndroid="transparent"
              selectionColor={Theme.colors.foreground}
              multiline={false}
              numberOfLines={1}
              scrollEnabled={false}
            />
            {tagLocationLoading ? (
              <View className="w-full flex-row items-center gap-2 rounded-lg py-2">
                <ActivityIndicator size="small" color={Theme.colors.primary} />
                <Text className="text-sm text-muted-foreground">Getting your location…</Text>
              </View>
            ) : (
              <Pressable
                onPress={onTagLocationPress}
                className="w-full flex-row items-center gap-1.5 rounded-lg py-2 active:opacity-90"
                accessibilityRole="button"
                accessibilityLabel={
                  onlineGeotag ? 'Update geotagged location' : 'Tag current location'
                }
              >
                <MapPin size={18} color={Theme.colors.secondaryText} />
                <Text className="text-sm text-muted-foreground">
                  {onlineGeotag
                    ? `Geotagged (${onlineGeotag.lat.toFixed(4)}, ${onlineGeotag.lng.toFixed(4)})`
                    : 'Tag current location'}
                </Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
