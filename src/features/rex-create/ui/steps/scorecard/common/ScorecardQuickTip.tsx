import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CREATE_REC_MUST_KNOW_MAX } from '~/features/rex-create/config/scorecard';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import { quickTipCopyForCategory } from '~/features/rex-create/lib/quickTipCopy';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { webNoOutline } from '~/utils';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  categoryCode: string | null;
  categoryDisplayName?: string | null;
};

function ScorecardQuickTip({ value, onChangeText, categoryCode, categoryDisplayName }: Props) {
  const copy = quickTipCopyForCategory(categoryCode, categoryDisplayName);

  return (
    <View>
      <View className="mb-2 flex-row flex-wrap items-center gap-2">
        <Text className="text-xs font-medium uppercase tracking-wider text-black">
          {copy.label}
        </Text>
        <Text className="text-[10px] italic text-black opacity-70">optional</Text>
      </View>
      <Text className="mb-3 text-sm italic text-black opacity-85">{copy.helper}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={copy.helper}
        placeholderTextColor={Theme.colors.secondaryText}
        maxLength={CREATE_REC_MUST_KNOW_MAX}
        className={`w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
        style={[
          webNoOutline,
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
        underlineColorAndroid="transparent"
        selectionColor={Theme.colors.foreground}
      />
      <Text className="mt-2 text-right text-[10px] text-black opacity-70">
        {value.length}/{CREATE_REC_MUST_KNOW_MAX}
      </Text>
    </View>
  );
}

export default ScorecardQuickTip;
