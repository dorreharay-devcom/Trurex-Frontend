import React from 'react';
import { Platform } from 'react-native';
import {
  Theme,
  textFieldCaretStyle,
  textFieldNativeSingleLineNoWrapStyle,
  textFieldSingleLineLargeHeightStyle,
  textFieldSingleLineStyle,
} from '~/theme/Theme';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import { cn } from '~/utils/general';
import { webNoOutline } from './webInputOutline';
import { ClearableSearchInput } from '~/components/common/ClearableSearchInput';

type Props = {
  value: string;
  onChangeText: (q: string) => void;
};

export function SearchQueryField({ value, onChangeText }: Props) {
  return (
    <ClearableSearchInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Search by name..."
      placeholderTextColor={Theme.colors.secondaryText}
      containerClassName="mb-4"
      iconClassName="left-3.5"
      iconColor={Theme.colors.secondaryText}
      clearIconColor={Theme.colors.secondaryText}
      iconSize={20}
      inputClassName={cn(
        'w-full rounded-xl border border-border bg-muted/50 pl-11 pr-10 text-base text-foreground',
        Platform.OS === 'web' ? 'py-3.5' : 'py-0',
        INPUT_FOCUS_RING_CLASS,
      )}
      autoCorrect={false}
      autoCapitalize="none"
      underlineColorAndroid="transparent"
      selectionColor={Theme.colors.foreground}
      inputStyle={[
        webNoOutline,
        textFieldCaretStyle,
        textFieldSingleLineStyle,
        textFieldSingleLineLargeHeightStyle,
        textFieldNativeSingleLineNoWrapStyle,
      ]}
    />
  );
}
