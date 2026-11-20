import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Store, User } from 'lucide-react-native';
import {
  SIGNUP_ACCOUNT_TYPE,
  SIGNUP_ACCOUNT_TYPE_CONFIG,
  SIGNUP_ACCOUNT_TYPES,
  type SignupAccountType,
} from '~/features/auth/config/signupAccountType';
import { cn } from '~/shared/lib/ui/styles';

const TAB_ICON = {
  [SIGNUP_ACCOUNT_TYPE.personal]: User,
  [SIGNUP_ACCOUNT_TYPE.business]: Store,
} as const;

const ICON_COLOR = {
  selected: '#1f1f1f',
  idle: '#8a8a8a',
} as const;

type Props = {
  value: SignupAccountType;
  onChange: (type: SignupAccountType) => void;
  disabled?: boolean;
};

const SignupAccountTypeTabs = ({ value, onChange, disabled }: Props) => (
  <View className="gap-2">
    <Text className="text-center text-[11px] font-medium uppercase tracking-[1.5px] text-muted-foreground">
      Continue as
    </Text>
    <View
      accessibilityRole="tablist"
      className={cn('flex-row rounded-full bg-neutral-200/60 p-1', disabled && 'opacity-50')}
    >
      {SIGNUP_ACCOUNT_TYPES.map((type) => {
        const selected = type === value;
        const Icon = TAB_ICON[type];
        const label = SIGNUP_ACCOUNT_TYPE_CONFIG[type].tabLabel;
        return (
          <Pressable
            key={type}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(type)}
            className={cn(
              'flex-1 flex-row items-center justify-center gap-1.5 rounded-full px-3 py-2',
              selected && 'bg-white shadow-sm',
            )}
          >
            <Icon
              size={15}
              strokeWidth={2}
              color={selected ? ICON_COLOR.selected : ICON_COLOR.idle}
            />
            <Text
              numberOfLines={1}
              className={cn(
                'shrink text-[13px] font-semibold',
                selected ? 'text-[#1f1f1f]' : 'text-muted-foreground',
              )}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

export default SignupAccountTypeTabs;
