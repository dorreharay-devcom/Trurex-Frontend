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
  onProfilePress: () => void;
};

function AccountModeSwitcher({ children, onProfilePress }: Props) {
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

  if (!canSwitch) {
    return (
      <TouchableOpacity
        onPress={onProfilePress}
        accessibilityRole="button"
        accessibilityLabel="Profile"
        className="items-center justify-center"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${current?.label ?? ''} account. Switch account`}
        className="flex-row items-center gap-0.5 rounded-xl border border-border bg-background p-1 pr-1.5"
      >
        {children}
        <View className="items-center justify-center p-1">
          <ChevronDown size={16} color={Theme.colors.foreground} />
        </View>
      </TouchableOpacity>
      <AccountModeSheet open={open} mode={mode} onSelect={select} onClose={() => setOpen(false)} />
    </>
  );
}

export default AccountModeSwitcher;
