import React from 'react';
import { TextInput } from 'react-native';
import FieldWithCounter from '~/features/collections/ui/common/FieldWithCounter';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';

const NAME_MAX_LENGTH = 60;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function EditNameField({ value, onChange }: Props) {
  return (
    <FieldWithCounter label="Name *" count={value.length} max={NAME_MAX_LENGTH}>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.slice(0, NAME_MAX_LENGTH))}
        placeholder="Collection name"
        placeholderTextColor={Theme.colors.secondaryText}
        style={[
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-search-field text-sm text-foreground"
      />
    </FieldWithCounter>
  );
}

export default EditNameField;
