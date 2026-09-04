import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';
import { INPUT_FOCUS_BORDER_CLASS } from '~/shared/config/inputFocus';
import { webNoOutline, cn } from '~/shared/lib/ui/styles';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function CollectionDescriptionField({ value, onChange }: Props) {
  return (
    <View>
      <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
        Description (optional)
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="What's this list about? Who's it for?"
        placeholderTextColor={Theme.colors.secondaryText}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
        style={[webNoOutline, textFieldCaretStyle, textFieldMultilineStyle]}
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-border bg-search-field px-4 py-3 text-sm text-foreground',
          INPUT_FOCUS_BORDER_CLASS,
        )}
      />
    </View>
  );
}

export default CollectionDescriptionField;
