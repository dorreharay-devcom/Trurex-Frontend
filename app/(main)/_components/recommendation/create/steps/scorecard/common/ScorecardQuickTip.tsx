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
      <View className="mb-2 flex-row flex-wrap items-baseline gap-x-1.5">
        <Text className="text-[10px] font-normal uppercase tracking-wide text-foreground">
          Quick tip
        </Text>
        <Text className="text-xs font-normal italic text-muted">optional</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="What's their must-order?"
        placeholderTextColor={Theme.colors.secondaryText}
        className="w-full rounded-[12px] border border-border bg-muted/50 px-4 py-3 text-sm font-normal text-foreground focus:outline-none focus:border-primary"
        style={[webNoOutline, textFieldCaretStyle]}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
      />
    </View>
  );
}
