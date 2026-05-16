import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { webNoOutline } from '../../search/common/webInputOutline';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
};

export function ScorecardQuickTip({ value, onChangeText }: Props) {
  return (
    <View>
      <View className="mb-2 flex-row flex-wrap items-center gap-2">
        <Text className="text-xs font-medium uppercase tracking-wider text-black">
          Quick tip
        </Text>
        <Text className="text-[10px] italic text-black opacity-70">optional</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Share your quick tip"
        placeholderTextColor={Theme.colors.secondaryText}
        className={`w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
        style={[webNoOutline, textFieldCaretStyle]}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
      />
    </View>
  );
}
