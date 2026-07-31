import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Reply, Send } from 'lucide-react-native';
import { webNoOutline } from '~/utils';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineCompactHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { cn } from '~/utils/general';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import type { CommentComposerState } from '~/features/rex-detail/hooks/comments/useCommentComposer';

export type CommentComposerProps = {
  composer: CommentComposerState;
  composerAnchorRef?: React.RefObject<View | null>;
  onInputFocus?: () => void;
};

export const CommentComposer: React.FC<CommentComposerProps> = ({
  composer,
  composerAnchorRef,
  onInputFocus,
}) => {
  const { text, setText, replyTo, posting, inputRef, post, cancelReply } = composer;
  const canSubmit = text.trim().length > 0 && !posting;

  return (
    <View ref={composerAnchorRef} collapsable={false} className="gap-2">
      {replyTo ? (
        <View className="flex-row items-center gap-2">
          <Reply size={12} color={Theme.colors.secondaryText} />
          <Text className="text-xs text-muted-foreground">Replying to a comment</Text>
          <Pressable onPress={cancelReply} accessibilityRole="button" className="active:opacity-70">
            <Text className="text-xs font-medium text-foreground">Cancel</Text>
          </Pressable>
        </View>
      ) : null}
      <View className="flex-row items-center gap-2">
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          placeholder="Ask a question or leave a note..."
          placeholderTextColor={Theme.colors.secondaryText}
          className={`min-h-10 min-w-0 flex-1 rounded-xl border border-border/80 bg-border/40 px-3 py-2.5 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
          style={[
            webNoOutline,
            textFieldCaretStyle,
            textFieldSingleLineStyle,
            textFieldSingleLineCompactHeightStyle,
          ]}
          onFocus={onInputFocus}
          multiline={false}
          numberOfLines={1}
          scrollEnabled={false}
          underlineColorAndroid="transparent"
          selectionColor={Theme.colors.foreground}
          onSubmitEditing={() => void post()}
          editable={!posting}
          returnKeyType="send"
        />
        <View className={cn(!canSubmit && 'cursor-not-allowed')}>
          <Pressable
            onPress={() => {
              if (!canSubmit) return;
              void post();
            }}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Send comment"
            accessibilityState={{ disabled: !canSubmit }}
            className={cn(
              'h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80',
              canSubmit
                ? 'cursor-pointer bg-primary active:opacity-90'
                : 'cursor-not-allowed bg-primary/40 opacity-40',
            )}
          >
            <Send size={16} color={Theme.colors.primaryForeground} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
