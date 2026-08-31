import React from 'react';
import { isWeb } from '~/shared/lib/ui/platform';
import {
  Theme,
  textFieldCaretStyle,
  textFieldNativeSingleLineNoWrapStyle,
  textFieldSingleLineLargeHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { INPUT_FOCUS_RING_CLASS } from '~/shared/config/inputFocus';
import { ClearableSearchInput } from '~/shared/ui/primitives/ClearableSearchInput';
import { webDisabledCursor, webNoOutline, cn } from '~/shared/lib/ui/styles';

type Props = {
  value: string;
  onChangeText: (q: string) => void;
  placeholder?: string;
  editable?: boolean;
};

function SearchQueryField({
  value,
  onChangeText,
  placeholder = 'Search by name...',
  editable = true,
}: Props) {
  return (
    <ClearableSearchInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Theme.colors.secondaryText}
      editable={editable}
      containerClassName={cn('mb-4', !editable && 'cursor-not-allowed opacity-50')}
      iconClassName="left-3.5"
      iconColor={Theme.colors.secondaryText}
      clearIconColor={Theme.colors.secondaryText}
      iconSize={20}
      inputClassName={cn(
        'w-full rounded-xl border border-border bg-muted/50 pl-11 pr-10 text-base text-foreground',
        isWeb ? 'py-3.5' : 'py-0',
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
        webDisabledCursor(!editable),
      ]}
    />
  );
}

export default SearchQueryField;
