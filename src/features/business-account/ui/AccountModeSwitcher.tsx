import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import {
  ACCOUNT_MODE_OPTIONS,
  type AccountMode,
} from '~/features/business-account/config/accountMode';
import AccountModeSheet from '~/features/business-account/ui/AccountModeSheet';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  mode: AccountMode;
  onChange: (mode: AccountMode) => void;
};

function AccountModeSwitcher({ mode, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = ACCOUNT_MODE_OPTIONS.find((option) => option.id === mode);

  const select = useCallback(
    (next: AccountMode) => {
      onChange(next);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${current?.label ?? ''} account. Switch account`}
        className="flex-row items-center gap-1 rounded-full border border-border bg-background px-3 py-2"
      >
        <Text className="text-sm font-medium text-foreground">{current?.label}</Text>
        <ChevronDown size={16} color={Theme.colors.muted} />
      </TouchableOpacity>
      <AccountModeSheet open={open} mode={mode} onSelect={select} onClose={() => setOpen(false)} />
    </>
  );
}

export default AccountModeSwitcher;
