import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Reply, Send } from 'lucide-react-native';
import { webNoOutline } from '~/components/recommendation/create/steps/search/common/webInputOutline';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';

export type CommentComposerProps = {
  composerAnchorRef?: React.RefObject<View | null>;
  inputRef: React.RefObject<TextInput | null>;
  text: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  replyToId: string | null;
  onCancelReply: () => void;
};

export const CommentComposer: React.FC<CommentComposerProps> = ({
  composerAnchorRef,
  inputRef,
  text,
  onChangeText,
  onSubmit,
  replyToId,
  onCancelReply,
}) => (
  <View ref={composerAnchorRef} collapsable={false} className="gap-2">
    {replyToId ? (
      <View className="flex-row items-center gap-2">
        <Reply size={12} color={Theme.colors.secondaryText} />
        <Text className="text-xs text-muted-foreground">Replying to a comment</Text>
        <Pressable onPress={onCancelReply} accessibilityRole="button">
          <Text className="text-xs font-medium text-primary">Cancel</Text>
        </Pressable>
      </View>
    ) : null}
    <View className="flex-row items-center gap-2">
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={onChangeText}
        placeholder="Ask a question or leave a note..."
        placeholderTextColor={Theme.colors.foreground}
        className="min-h-10 min-w-0 flex-1 rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
        style={[webNoOutline, textFieldCaretStyle]}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
        onSubmitEditing={() => void onSubmit()}
        returnKeyType="send"
      />
      <Pressable
        onPress={() => void onSubmit()}
        disabled={!text.trim()}
        accessibilityRole="button"
        accessibilityLabel="Send comment"
        className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary active:opacity-90 disabled:opacity-40"
      >
        <Send size={16} color={Theme.colors.primaryForeground} />
      </Pressable>
    </View>
  </View>
);
