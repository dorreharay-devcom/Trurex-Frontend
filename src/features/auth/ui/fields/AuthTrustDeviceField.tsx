import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label?: string;
};

const AuthTrustDeviceField = ({
  checked,
  onToggle,
  label = 'Trust this device for 30 days',
}: Props) => {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className="flex-row items-center gap-2 self-start active:opacity-90"
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded border',
          checked ? 'border-primary bg-primary' : 'border-muted-foreground bg-transparent',
        )}
      >
        {checked && <Check size={13} color={Theme.colors.primaryForeground} />}
      </View>
      <Text className="text-sm text-foreground">{label}</Text>
    </Pressable>
  );
};

export default AuthTrustDeviceField;
