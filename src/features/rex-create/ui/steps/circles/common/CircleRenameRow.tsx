import React from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Check, X } from 'lucide-react-native';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { webNoOutline } from '~/utils';

const fieldBg = { backgroundColor: Theme.colors.searchFieldBackground };

type Props = {
  name: string;
  onChangeName: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
};

function CircleRenameRow({ name, onChangeName, onSave, onCancel, busy }: Props) {
  return (
    <View className="mx-auto w-full max-w-sm flex-row items-center gap-2">
      <TextInput
        value={name}
        onChangeText={onChangeName}
        placeholder="Circle name"
        placeholderTextColor={Theme.colors.secondaryText}
        className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground"
        style={[
          fieldBg,
          webNoOutline,
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
        maxLength={32}
        editable={!busy}
        onSubmitEditing={onSave}
      />
      <Pressable
        onPress={onSave}
        accessibilityRole="button"
        accessibilityLabel="Save name"
        disabled={busy}
        className="rounded-lg bg-primary p-2 active:opacity-90 disabled:opacity-50"
      >
        <Check size={18} color={Theme.colors.primaryForeground} />
      </Pressable>
      <Pressable
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Cancel editing"
        disabled={busy}
        className="rounded-lg border border-border p-2 active:opacity-90 disabled:opacity-50"
        style={fieldBg}
      >
        <X size={18} color={Theme.colors.destructive} />
      </Pressable>
    </View>
  );
}

export default CircleRenameRow;
