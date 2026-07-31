import React from 'react';
import { Text, TextInput, View, type TextInput as TextInputType } from 'react-native';
import type { CircleFormState } from '~/features/circles/hooks/useCircleForm';
import {
  Theme,
  textFieldCaretStyle,
  textFieldMultilineStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { cn } from '~/utils/general';
import CircleColorPicker from '~/features/circles/ui/form/CircleColorPicker';

const NAME_MAX_LENGTH = 40;
const DESCRIPTION_MAX_LENGTH = 100;

type Props = {
  form: CircleFormState;
  fieldBg?: 'bg-background' | 'bg-search-field';
  nameInputRef?: React.RefObject<TextInputType | null>;
};

const CircleFormFields = ({ form, fieldBg = 'bg-background', nameInputRef }: Props) => {
  const fieldClassName = cn(
    'rounded-xl border border-border px-3 py-3 text-sm text-foreground',
    fieldBg,
  );

  return (
    <View className="gap-3">
      <TextInput
        ref={nameInputRef}
        placeholder="Circle name..."
        placeholderTextColor={Theme.colors.muted}
        value={form.name}
        onChangeText={form.setName}
        maxLength={NAME_MAX_LENGTH}
        className={fieldClassName}
        style={[
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
      />
      <TextInput
        placeholder="Description (optional)"
        placeholderTextColor={Theme.colors.muted}
        value={form.description}
        onChangeText={form.setDescription}
        maxLength={DESCRIPTION_MAX_LENGTH}
        multiline
        className={cn('min-h-[44px]', fieldClassName)}
        style={[textFieldCaretStyle, textFieldMultilineStyle]}
      />
      <View>
        <Text className="mb-2 text-xs text-muted-foreground">Color</Text>
        <CircleColorPicker selected={form.color} onSelect={form.setColor} />
      </View>
    </View>
  );
};

export default CircleFormFields;
