import React, { useCallback, useState, type ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import {
  ACCOUNT_MODE_OPTIONS,
  type AccountMode,
} from '~/features/business-account/config/accountMode';
import { useAccountMode } from '~/features/business-account/hooks/useAccountMode';
import AccountModeSheet from '~/features/business-account/ui/AccountModeSheet';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  children: ReactNode;
};

function AccountModeSwitcher({ children }: Props) {
  const { mode, canSwitch, setMode } = useAccountMode();
  const [open, setOpen] = useState(false);
  const current = ACCOUNT_MODE_OPTIONS.find((option) => option.id === mode);

  const select = useCallback(
    (next: AccountMode) => {
      setMode(next);
      setOpen(false);
    },
    [setMode],
  );

  if (!canSwitch) return <>{children}</>;

  return (
    <View className="flex-row items-center gap-0.5 rounded-full border border-border bg-background py-0.5 pl-0.5 pr-1.5">
      {children}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`${current?.label ?? ''} account. Switch account`}
        className="items-center justify-center p-1"
      >
        <ChevronDown size={16} color={Theme.colors.foreground} />
      </TouchableOpacity>
      <AccountModeSheet open={open} mode={mode} onSelect={select} onClose={() => setOpen(false)} />
    </View>
  );
}

export default AccountModeSwitcher;
