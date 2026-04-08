import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CREATE_REC_REVIEW_MAX } from '~/constants/recommendation/createScorecard';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { webNoOutline } from '../../search/common/webInputOutline';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
};

export function ScorecardReview({ value, onChangeText }: Props) {
  const reviewLen = value.length;
  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Your review
        </Text>
        <Text className="text-[10px] text-muted-foreground opacity-60">
          {reviewLen}/{CREATE_REC_REVIEW_MAX}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Share your experience in your own words..."
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
