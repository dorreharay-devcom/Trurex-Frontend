import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  REX_NOTE_MAX_LENGTH,
  type RexNoteEditorState,
} from '~/features/collections/hooks/collection-detail/useRexNoteEditor';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';

type Props = {
  rexId: string;
  editor: RexNoteEditorState;
};

function RexNoteEditor({ rexId, editor }: Props) {
  return (
    <View className="mx-3 mb-3">
      <TextInput
        value={editor.text}
        onChangeText={editor.changeText}
        placeholder="Add a personal note…"
        placeholderTextColor={Theme.colors.muted}
        multiline
        autoFocus
        maxLength={REX_NOTE_MAX_LENGTH}
        className="min-h-[56px] rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-foreground"
        style={[textFieldCaretStyle, textFieldMultilineStyle]}
      />
      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-[10px] text-muted-foreground">
          {editor.text.length}/{REX_NOTE_MAX_LENGTH}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={editor.close}
            className="rounded-lg border border-border bg-card px-3 py-1.5"
          >
            <Text className="text-xs font-medium text-foreground">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => editor.save(rexId)}
            className="px-3 py-1.5 rounded-lg bg-primary"
          >
            <Text className="text-xs font-medium text-primary-foreground">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default RexNoteEditor;
