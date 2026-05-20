import React from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import { Reply, Send } from 'lucide-react-native';
import { webNoOutline } from '~/components/recommendation/create/steps/search/common/webInputOutline';
import { Theme, textFieldCaretStyle, textFieldSingleLineStyle } from '~/theme/Theme';
import { cn } from '~/utils/general';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';

const isWeb = Platform.OS === 'web';

export type CommentComposerProps = {
  composerAnchorRef?: React.RefObject<View | null>;
  inputRef: React.RefObject<TextInput | null>;
  text: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  replyToId: string | null;
  onCancelReply: () => void;
  onInputFocus?: () => void;
};

export const CommentComposer: React.FC<CommentComposerProps> = ({
  composerAnchorRef,
  inputRef,
  text,
  onChangeText,
  onSubmit,
  replyToId,
  onCancelReply,
  onInputFocus,
}) => {
  const canSubmit = text.trim().length > 0;

  return (
    <View ref={composerAnchorRef} collapsable={false} className="gap-2">
      {replyToId ? (
        <View className="flex-row items-center gap-2">
          <Reply size={12} color={Theme.colors.secondaryText} />
          <Text className="text-xs text-muted-foreground">Replying to a comment</Text>
          <Pressable onPress={onCancelReply} accessibilityRole="button" className="active:opacity-70">
            <Text className="text-xs font-medium text-foreground">Cancel</Text>
          </Pressable>
        </View>
      ) : null}
      <View className="flex-row items-center gap-2">
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={onChangeText}
          placeholder="Ask a question or leave a note..."
          placeholderTextColor={Theme.colors.secondaryText}
          className={`min-h-10 min-w-0 flex-1 rounded-xl border border-border/80 bg-border/40 px-3 py-2.5 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
          style={[webNoOutline, textFieldCaretStyle, textFieldSingleLineStyle]}
          onFocus={onInputFocus}
          multiline={false}
          numberOfLines={1}
          scrollEnabled={false}
          underlineColorAndroid="transparent"
          selectionColor={Theme.colors.foreground}
          onSubmitEditing={() => void onSubmit()}
          returnKeyType="send"
        />
        <View
          className={cn(!canSubmit && 'cursor-not-allowed')}
          style={!canSubmit && isWeb ? ({ cursor: 'not-allowed' } as const) : undefined}
        >
          <Pressable
            onPress={() => {
              if (!canSubmit) return;
              void onSubmit();
            }}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Send comment"
            accessibilityState={{ disabled: !canSubmit }}
            style={!canSubmit && isWeb ? ({ cursor: 'not-allowed' } as const) : undefined}
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
