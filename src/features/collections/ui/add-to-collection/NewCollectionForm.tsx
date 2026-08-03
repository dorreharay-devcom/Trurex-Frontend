import React from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { cn, webDisabledCursor } from '~/shared/lib/ui/styles';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';

const NAME_MAX_LENGTH = 60;

type Props = {
  name: string;
  creating: boolean;
  onChangeName: (name: string) => void;
  onSubmit: () => void;
};

function NewCollectionForm({ name, creating, onChangeName, onSubmit }: Props) {
  const canSubmit = Boolean(name.trim()) && !creating;

  return (
    <View className="flex-row gap-2">
      <TextInput
        value={name}
        onChangeText={(v) => onChangeName(v.slice(0, NAME_MAX_LENGTH))}
        placeholder="Collection name…"
        placeholderTextColor={Theme.colors.muted}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        className="flex-1 rounded-lg border border-border bg-search-field px-3 py-2.5 text-sm text-foreground"
        style={[
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
      />
      <Pressable
        onPress={() => {
          if (!canSubmit) return;
          onSubmit();
        }}
        disabled={!canSubmit}
        style={webDisabledCursor(!canSubmit)}
        className={cn(
          'items-center justify-center rounded-lg px-4',
          canSubmit
            ? 'cursor-pointer bg-primary active:opacity-90'
            : 'cursor-not-allowed bg-primary/40 opacity-50',
        )}
      >
        {creating ? (
          <ActivityIndicator size="small" color={Theme.colors.primaryForeground} />
        ) : (
          <Text className="text-sm font-medium text-primary-foreground">Create & add</Text>
        )}
      </Pressable>
    </View>
  );
}

export default NewCollectionForm;
