import React from 'react';
import { TextInput } from 'react-native';
import FieldWithCounter from '~/features/collections/ui/common/FieldWithCounter';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { INPUT_FOCUS_BORDER_CLASS } from '~/shared/config/inputFocus';
import { webNoOutline } from '~/utils';
import { cn } from '~/utils/general';

const NAME_MAX_LENGTH = 60;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function CollectionNameField({ value, onChange }: Props) {
  return (
    <FieldWithCounter label="Name your collection *" count={value.length} max={NAME_MAX_LENGTH}>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.slice(0, NAME_MAX_LENGTH))}
        placeholder="e.g. My Ideal Weekend in Lisbon, Best Hikes in Sydney…"
        placeholderTextColor={Theme.colors.secondaryText}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
        style={[
          webNoOutline,
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
        className={cn(
          'w-full rounded-xl border border-border bg-search-field px-4 py-3 text-sm text-foreground',
          INPUT_FOCUS_BORDER_CLASS,
        )}
      />
    </FieldWithCounter>
  );
}

export default CollectionNameField;
