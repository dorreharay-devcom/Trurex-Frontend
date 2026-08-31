import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import { Theme, textFieldCaretStyle } from '~/shared/theme/Theme';
import { INPUT_FOCUS_RING_CLASS } from '~/shared/config/inputFocus';
import { cn, webNoOutline } from '~/shared/lib/ui/styles';
import { ClearableSearchInput } from '~/shared/ui/primitives/ClearableSearchInput';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  filterSlot?: ReactNode;
  trailingSlot?: ReactNode;
};

const TabSearchRow = ({
  value,
  onChangeText,
  placeholder = 'Search',
  filterSlot,
  trailingSlot,
}: Props) => (
  <View className="flex-row items-center gap-3 mb-4">
    <ClearableSearchInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Theme.colors.muted}
      containerClassName="flex-1"
      inputClassName={cn(
        'h-10 rounded-xl border border-border bg-card pl-9 pr-9 text-sm text-foreground',
        INPUT_FOCUS_RING_CLASS,
      )}
      inputStyle={[webNoOutline, textFieldCaretStyle]}
    />
    {filterSlot}
    {trailingSlot}
  </View>
);

export default TabSearchRow;
