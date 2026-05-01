import React from 'react';
import { View, Text, TextInput } from 'react-native';
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
        placeholder="What's their must-order?"
        placeholderTextColor={Theme.colors.secondaryText}
        className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
        style={[webNoOutline, textFieldCaretStyle]}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
      />
    </View>
  );
}
