import React, { useState, type ReactNode } from 'react';
import { View, TextInput, Pressable, Text, ScrollView, Platform } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { MAP_ACTION_INSET } from '~/constants/map/mapUi';
import { Theme } from '~/theme/Theme';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  suggestions?: string[];
  onSelectSuggestion?: (s: string) => void;
  trailing?: ReactNode;
};

export const MapSearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  suggestions = [],
  onSelectSuggestion,
  trailing,
}) => {
  const [focused, setFocused] = useState(false);
  const showSuggestions = focused && value.trim().length > 1 && suggestions.length > 0;

  return (
    <View
      pointerEvents="box-none"
      className="absolute z-[1300]"
      style={{
        position: 'absolute',
        left: MAP_ACTION_INSET,
        right: MAP_ACTION_INSET,
        top: MAP_ACTION_INSET,
        zIndex: 1300,
        elevation: Platform.OS === 'android' ? 16 : 0,
      }}
    >
      <View className="flex-row items-start gap-2">
        <View className="relative min-w-0 flex-1">
          <View className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -mt-2">
            <Search size={16} color={Theme.colors.secondaryText} />
          </View>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
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
        {trailing ? <View className="shrink-0 items-end gap-2">{trailing}</View> : null}
      </View>

      {showSuggestions ? (
        <View className="mt-1.5 overflow-hidden rounded-xl border border-border bg-card/95 shadow-md">
          <ScrollView keyboardShouldPersistTaps="handled" className="max-h-48">
            {suggestions.map((s) => (
              <Pressable
                key={s}
                onPress={() => {
                  onChangeText(s);
                  onSelectSuggestion?.(s);
                }}
                {...(Platform.OS === 'web'
                  ? {
                      onMouseDown: (e: { preventDefault: () => void }) => e.preventDefault(),
                    }
                  : {})}
                className="flex-row items-center gap-2 border-b border-border/60 px-4 py-2.5 active:bg-muted/30"
              >
                <Search size={12} color={Theme.colors.secondaryText} />
                <Text className="flex-1 text-sm text-foreground" numberOfLines={1}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};
