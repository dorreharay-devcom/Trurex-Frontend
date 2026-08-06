import React, { useEffect, useRef, useState } from 'react';
import {
  Theme,
  textFieldCaretStyle,
  textFieldHeaderSearchStyle,
  textFieldSingleLineCompactHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';
import { INPUT_FOCUS_RING_CLASS } from '~/shared/config/inputFocus';
import { ClearableSearchInput } from '~/shared/ui/primitives/ClearableSearchInput';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';

const inputStyle = [
  textFieldCaretStyle,
  { backgroundColor: Theme.colors.searchFieldBackground },
  textFieldSingleLineStyle,
  textFieldSingleLineCompactHeightStyle,
  textFieldHeaderSearchStyle,
];

type Props = {
  initialValue?: string;
  onDebouncedChange: (text: string) => void;
};

const HeaderSearch = ({ initialValue = '', onDebouncedChange }: Props) => {
  const [text, setText] = useState(initialValue);
  const debounced = useDebouncedValue(text, DEFAULT_SEARCH_DEBOUNCE_MS);
  const onDebouncedChangeRef = useRef(onDebouncedChange);
  onDebouncedChangeRef.current = onDebouncedChange;

  useEffect(() => {
    onDebouncedChangeRef.current(debounced);
  }, [debounced]);

  return (
    <ClearableSearchInput
      value={text}
      onChangeText={setText}
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
};

export default HeaderSearch;
