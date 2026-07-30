import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CREATE_REC_REVIEW_MAX } from '~/constants/recommendation/createScorecard';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';
import { webNoOutline } from '../../search/common/webInputOutline';

type Props = {
  title?: string;
  showOptionalHint?: boolean;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
};

export function ScorecardReview({
  title = 'Your review',
  showOptionalHint = false,
  placeholder = 'Share your experience in your own words...',
  value,
  onChangeText,
}: Props) {
  return (
    <View>
      <View className="mb-2 flex-row flex-wrap items-center gap-x-2 gap-y-1">
        <Text className="text-xs font-medium uppercase tracking-wider text-black">{title}</Text>
        {showOptionalHint ? (
          <Text className="text-[10px] italic text-black opacity-80">optional</Text>
        ) : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Theme.colors.secondaryText}
        className={`flex min-h-[90px] w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
        style={[webNoOutline, textFieldCaretStyle, textFieldMultilineStyle]}
        multiline
        textAlignVertical="top"
        maxLength={CREATE_REC_REVIEW_MAX}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
      />
    </View>
  );
}
