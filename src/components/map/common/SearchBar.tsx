import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { Theme, textFieldCaretStyle, textFieldSingleLineStyle } from '~/theme/Theme';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  showFilters: boolean;
  filtersActive: boolean;
  onToggleFilters: () => void;
};

export const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  showFilters,
  filtersActive,
  onToggleFilters,
}) => (
  <View className="relative mb-4">
    <View pointerEvents="none" className="absolute left-3.5 top-0 bottom-0 z-10 justify-center">
      <Search size={16} color={Theme.colors.secondaryText} />
    </View>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Search nearby — restaurants, cafés, bars..."
      placeholderTextColor={Theme.colors.muted}
      className="w-full pl-10 pr-24 py-3 rounded-2xl bg-card border border-border text-sm text-foreground"
      style={[textFieldCaretStyle, textFieldSingleLineStyle]}
      multiline={false}
      numberOfLines={1}
      scrollEnabled={false}
    />
    <View className="absolute right-2 top-0 bottom-0 flex-row items-center gap-1">
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          className="p-1.5 rounded-lg active:bg-muted/50"
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <X size={16} color={Theme.colors.secondaryText} />
        </Pressable>
      )}
      <Pressable
        onPress={onToggleFilters}
        className={`p-2 rounded-xl ${showFilters || filtersActive ? 'bg-primary/10' : 'active:bg-muted/50'}`}
        accessibilityRole="button"
        accessibilityLabel="Toggle filters"
      >
        <SlidersHorizontal
          size={16}
          color={showFilters || filtersActive ? Theme.colors.primary : Theme.colors.secondaryText}
        />
      </Pressable>
    </View>
  </View>
);
