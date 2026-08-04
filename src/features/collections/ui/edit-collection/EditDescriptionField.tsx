import React from 'react';
import { TextInput } from 'react-native';
import FieldWithCounter from '~/features/collections/ui/common/FieldWithCounter';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';

const DESCRIPTION_MAX_LENGTH = 200;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function EditDescriptionField({ value, onChange }: Props) {
  return (
    <FieldWithCounter
      label="Description (optional)"
      count={value.length}
      max={DESCRIPTION_MAX_LENGTH}
    >
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.slice(0, DESCRIPTION_MAX_LENGTH))}
        placeholder="What's this list about?"
        placeholderTextColor={Theme.colors.secondaryText}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        style={[textFieldCaretStyle, textFieldMultilineStyle]}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-search-field text-sm text-foreground"
      />
    </FieldWithCounter>
  );
}

export default EditDescriptionField;
