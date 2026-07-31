import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import {
  Theme,
  textFieldCaretStyle,
  textFieldNativeSingleLineNoWrapStyle,
  textFieldSingleLineLargeHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { isWeb, webNoOutline } from '~/utils';
import { cn } from '~/utils/general';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  editable?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  textContentType?: TextInputProps['textContentType'];
};

function SearchTextField({
  value,
  onChangeText,
  placeholder,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  editable = true,
  keyboardType,
  textContentType,
}: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Theme.colors.secondaryText}
      editable={editable}
      className={cn(
        'w-full rounded-xl border border-border bg-muted/50 px-4 text-base text-foreground',
        isWeb ? 'py-3.5' : 'py-0',
        INPUT_FOCUS_RING_CLASS,
      )}
      style={[
        webNoOutline,
        textFieldCaretStyle,
        textFieldSingleLineStyle,
        textFieldSingleLineLargeHeightStyle,
        textFieldNativeSingleLineNoWrapStyle,
      ]}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      textContentType={textContentType}
      underlineColorAndroid="transparent"
      selectionColor={Theme.colors.foreground}
      multiline={false}
      numberOfLines={1}
      scrollEnabled={false}
    />
  );
}

export default SearchTextField;
