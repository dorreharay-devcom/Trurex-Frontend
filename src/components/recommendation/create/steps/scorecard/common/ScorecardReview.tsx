import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CREATE_REC_REVIEW_MAX } from '~/constants/recommendation/createScorecard';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
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
  const reviewLen = value.length;
  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-x-2 gap-y-1">
          <Text className="text-xs font-medium uppercase tracking-wider text-black">
            {title}
          </Text>
          {showOptionalHint ? (
            <Text className="text-[10px] italic text-black opacity-80">optional</Text>
          ) : null}
        </View>
        <Text className="shrink-0 text-[10px] text-black opacity-70">
          {reviewLen}/{CREATE_REC_REVIEW_MAX}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Theme.colors.secondaryText}
        className="flex min-h-[90px] w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
        style={[webNoOutline, textFieldCaretStyle]}
        multiline
        textAlignVertical="top"
        maxLength={CREATE_REC_REVIEW_MAX}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
      />
    </View>
  );
}
