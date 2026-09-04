import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function EditDescriptionField({ value, onChange }: Props) {
  return (
    <View>
      <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
        Description (optional)
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="What's this list about?"
        placeholderTextColor={Theme.colors.secondaryText}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        style={[textFieldCaretStyle, textFieldMultilineStyle]}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-search-field text-sm text-foreground"
      />
    </View>
  );
}

export default EditDescriptionField;
