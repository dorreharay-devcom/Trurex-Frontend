import React from 'react';
import { View, TextInput } from 'react-native';
import { Search as SearchIcon } from 'lucide-react-native';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { webNoOutline } from './webInputOutline';

type Props = {
  value: string;
  onChangeText: (q: string) => void;
};

export function SearchQueryField({ value, onChangeText }: Props) {
  return (
    <View className="relative mb-4 w-full">
      <View className="pointer-events-none absolute left-4 top-0 bottom-0 z-10 justify-center">
        <SearchIcon size={18} color={Theme.colors.secondaryText} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
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
  );
}
