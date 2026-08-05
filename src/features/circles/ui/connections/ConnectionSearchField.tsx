import React from 'react';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { ClearableSearchInput } from '~/shared/ui/primitives/ClearableSearchInput';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

const ConnectionSearchField = ({ value, onChangeText, placeholder }: Props) => {
  return (
    <ClearableSearchInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Theme.colors.muted}
      containerClassName="mb-4 w-full max-w-md self-start"
      iconColor={Theme.colors.muted}
      clearIconColor={Theme.colors.muted}
      inputClassName="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground"
      inputStyle={[
        textFieldCaretStyle,
        textFieldSingleLineStyle,
        textFieldSingleLineDefaultHeightStyle,
      ]}
      multiline={false}
      numberOfLines={1}
      scrollEnabled={false}
    />
  );
};

export default ConnectionSearchField;
