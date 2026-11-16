import React from 'react';
import { Text, View } from 'react-native';
import { Store, User } from 'lucide-react-native';
import SelectableSheetRow from '~/features/collections/ui/common/SelectableSheetRow';
import {
  ACCOUNT_MODE,
  ACCOUNT_MODE_OPTIONS,
  type AccountMode,
} from '~/features/business-account/config/accountMode';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { withWebContainer } from '~/shared/lib/ui/styles';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';

const MODE_ICON = {
  [ACCOUNT_MODE.personal]: User,
  [ACCOUNT_MODE.business]: Store,
} as const;

type Props = {
  open: boolean;
  mode: AccountMode;
  onSelect: (mode: AccountMode) => void;
  onClose: () => void;
};

function AccountModeSheet({ open, mode, onSelect, onClose }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <View
        style={withWebContainer({
          paddingHorizontal: 12,
          paddingTop: isWeb ? 16 : 0,
          paddingBottom: 24,
          gap: 2,
        })}
      >
        <Text
          className="px-3 pb-3 font-display text-base font-medium text-foreground"
          accessibilityRole="header"
        >
          Switch account
        </Text>
        {ACCOUNT_MODE_OPTIONS.map((option) => {
          const Icon = MODE_ICON[option.id];
          return (
            <SelectableSheetRow
              key={option.id}
              thumbnail={
                <View className="h-10 w-10 items-center justify-center rounded-full bg-accent">
                  <Icon size={18} color={Theme.colors.accentForeground} />
                </View>
              }
              title={option.label}
              subtitle={option.description}
              selected={option.id === mode}
              onPress={() => onSelect(option.id)}
            />
          );
        })}
      </View>
    </BottomSheet>
  );
}

export default AccountModeSheet;
