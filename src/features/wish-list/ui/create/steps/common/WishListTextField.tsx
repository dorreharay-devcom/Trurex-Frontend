import React from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import {
  Theme,
  textFieldCaretStyle,
  textFieldMultilineStyle,
  textFieldNativeSingleLineNoWrapStyle,
  textFieldSingleLineLargeHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { INPUT_FOCUS_RING_CLASS } from '~/shared/config/inputFocus';
import { isWeb } from '~/shared/lib/ui/platform';
import { webNoOutline, cn } from '~/shared/lib/ui/styles';

type Props = {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

function WishListTextField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  multiline,
  autoCapitalize,
}: Props) {
  return (
    <View>
      <Text className="mb-1.5 text-xs font-semibold text-muted-foreground">
        {label}
        {required ? ' *' : ''}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Theme.colors.secondaryText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : undefined}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
        autoCapitalize={autoCapitalize}
        style={[
          webNoOutline,
          textFieldCaretStyle,
          multiline
            ? textFieldMultilineStyle
            : [
                textFieldSingleLineStyle,
                textFieldSingleLineLargeHeightStyle,
                textFieldNativeSingleLineNoWrapStyle,
              ],
        ]}
        className={cn(
          'w-full rounded-xl border border-border bg-muted/50 px-4 text-sm text-foreground',
          multiline ? 'min-h-[80px] py-3' : isWeb ? 'py-3.5' : 'py-0',
          INPUT_FOCUS_RING_CLASS,
        )}
      />
    </View>
  );
}

export default WishListTextField;
