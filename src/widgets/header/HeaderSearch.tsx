import React from 'react';
import {
  Theme,
  textFieldCaretStyle,
  textFieldHeaderSearchStyle,
  textFieldSingleLineCompactHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';
import { INPUT_FOCUS_RING_CLASS } from '~/shared/config/inputFocus';
import { ClearableSearchInput } from '~/shared/ui/ClearableSearchInput';

const inputStyle = [
  textFieldCaretStyle,
  { backgroundColor: Theme.colors.searchFieldBackground },
  textFieldSingleLineStyle,
  textFieldSingleLineCompactHeightStyle,
  textFieldHeaderSearchStyle,
];

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

const HeaderSearch = ({ value, onChangeText }: Props) => (
  <ClearableSearchInput
    value={value}
    onChangeText={onChangeText}
    placeholder="Search rex..."
    placeholderTextColor={Theme.colors.secondaryText}
    containerClassName="min-w-0 justify-center"
    iconColor={Theme.colors.secondaryText}
    clearIconColor={Theme.colors.secondaryText}
    inputClassName={cn(
      'header-search-input w-full min-w-0 shrink rounded-lg border border-border py-1.5 pl-9 pr-9 text-sm text-foreground',
      INPUT_FOCUS_RING_CLASS,
    )}
    inputStyle={inputStyle}
    selectionColor={Theme.colors.foreground}
    underlineColorAndroid="transparent"
    multiline={false}
    numberOfLines={1}
    scrollEnabled={false}
  />
);

export default HeaderSearch;
