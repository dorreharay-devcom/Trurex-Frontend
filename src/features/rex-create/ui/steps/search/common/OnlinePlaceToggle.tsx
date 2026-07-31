import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function OnlinePlaceToggle({ checked, onChange }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className="mb-3 mt-6 flex-row items-center gap-2 self-start active:opacity-90"
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded border',
          checked ? 'border-primary bg-primary' : 'border-muted-foreground bg-transparent',
        )}
      >
        {checked ? <Check size={13} color={Theme.colors.primaryForeground} /> : null}
      </View>
      <Text className="text-sm text-foreground">No fixed address (person, service, or online)</Text>
    </Pressable>
  );
}

export default OnlinePlaceToggle;
