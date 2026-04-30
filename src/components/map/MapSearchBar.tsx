import React, { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { MAP_ACTION_INSET } from '~/constants/map/mapUi';
import { Theme } from '~/theme/Theme';
import { MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH } from '~/utils/map/mapSearchSuggestions';
import { MapSearchRow } from '~/components/map/MapSearchRow';

const BLUR_DELAY_MS = 200;

const WEB_SUGGESTION_ROW_HANDLERS =
  Platform.OS === 'web'
    ? { onMouseDown: (e: { preventDefault: () => void }) => e.preventDefault() }
    : {};

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  suggestions?: Recommendation[];
  onSelectSuggestion?: (rec: Recommendation) => void;
  trailing?: ReactNode;
};

export function MapSearchBar({
  value,
  onChangeText,
  suggestions = [],
  onSelectSuggestion,
  trailing,
}: Props) {
  const [focused, setFocused] = useState(false);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(
    () => () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    },
    [],
  );

  const clearBlurTimer = useCallback(() => {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }, []);

  const handleFocus = useCallback(() => {
    clearBlurTimer();
    setFocused(true);
  }, [clearBlurTimer]);

  const handleBlur = useCallback(() => {
    clearBlurTimer();
    blurTimerRef.current = setTimeout(() => setFocused(false), BLUR_DELAY_MS);
  }, [clearBlurTimer]);

  const trimmedLen = value.trim().length;
  const showSuggestions = useMemo(
    () =>
      focused &&
      trimmedLen >= MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH &&
      suggestions.length > 0,
    [focused, trimmedLen, suggestions.length],
  );

  const pickSuggestion = useCallback(
    (rec: Recommendation) => {
      clearBlurTimer();
      setFocused(false);
      inputRef.current?.blur();
      onChangeText(rec.title);
      onSelectSuggestion?.(rec);
    },
    [clearBlurTimer, onChangeText, onSelectSuggestion],
  );

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <MapSearchRow
        field={
          <>
            <View className="relative w-full">
              <View className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -mt-2">
                <Search size={16} color={Theme.colors.secondaryText} />
              </View>
              <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search rex by name…"
                placeholderTextColor={Theme.colors.secondaryText}
                className="rounded-2xl border border-border bg-card/95 py-3 pl-10 pr-10 text-sm text-foreground shadow-md"
                accessibilityLabel="Search recommendations by name"
              />
              {value.length > 0 ? (
                <Pressable
                  onPress={() => onChangeText('')}
                  className="absolute right-3 top-1/2 z-[1] -mt-3 rounded-lg p-1 active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                >
                  <X size={16} color={Theme.colors.secondaryText} />
                </Pressable>
              ) : null}
            </View>

            {showSuggestions ? (
              <View className="mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-card/95 shadow-md">
                <ScrollView keyboardShouldPersistTaps="handled" className="max-h-48">
                  {suggestions.map((rec) => (
                    <Pressable
                      key={rec.id}
                      onPress={() => pickSuggestion(rec)}
                      {...WEB_SUGGESTION_ROW_HANDLERS}
                      className="border-b border-border/60 px-4 py-2.5 active:bg-muted/30"
                    >
                      <Text className="text-sm text-foreground" numberOfLines={1}>
                        {rec.title}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </>
        }
        trailingSlot={trailing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: MAP_ACTION_INSET,
    right: MAP_ACTION_INSET,
    top: MAP_ACTION_INSET,
    zIndex: 1300,
    elevation: Platform.OS === 'android' ? 16 : 0,
  },
});
