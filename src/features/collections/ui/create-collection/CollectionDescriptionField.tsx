import React from 'react';
import { TextInput } from 'react-native';
import FieldWithCounter from '~/features/collections/ui/common/FieldWithCounter';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';
import { INPUT_FOCUS_BORDER_CLASS } from '~/shared/config/inputFocus';
import { webNoOutline, cn } from '~/shared/lib/ui/styles';

const DESCRIPTION_MAX_LENGTH = 200;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function CollectionDescriptionField({ value, onChange }: Props) {
  return (
    <FieldWithCounter
      label="Description (optional)"
      count={value.length}
      max={DESCRIPTION_MAX_LENGTH}
    >
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.slice(0, DESCRIPTION_MAX_LENGTH))}
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
    </FieldWithCounter>
  );
}

export default CollectionDescriptionField;
