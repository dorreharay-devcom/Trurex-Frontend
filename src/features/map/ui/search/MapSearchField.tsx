import React, { type RefObject } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';

type Props = {
  inputRef: RefObject<TextInput | null>;
  value: string;
  onChangeText: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
};

const MapSearchField = ({ inputRef, value, onChangeText, onFocus, onBlur }: Props) => {
  return (
    <View className="relative w-full">
      <View pointerEvents="none" className="absolute left-3.5 top-1/2 z-[1] -mt-2">
        <Search size={16} color={Theme.colors.secondaryText} />
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search rex by name…"
        placeholderTextColor={Theme.colors.secondaryText}
        className="rounded-2xl border border-border bg-card/95 py-3 pl-10 pr-10 text-sm text-foreground shadow-md"
        style={[
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
        multiline={false}
        numberOfLines={1}
        scrollEnabled={false}
        accessibilityLabel="Search recommendations by name"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          className="absolute right-3 top-1/2 z-[1] -mt-3 rounded-lg p-1 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <X size={16} color={Theme.colors.secondaryText} />
        </Pressable>
      )}
    </View>
  );
};

export default MapSearchField;
