import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

type Props = {
  selected: boolean;
  onChange: (selected: boolean) => void;
};

function PrivateRexToggle({ selected, onChange }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!selected)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      className="mx-auto flex-row items-center gap-2 active:opacity-90"
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-md border',
          selected ? 'border-primary bg-primary' : 'border-primary bg-card',
        )}
      >
        {selected ? <Check size={13} color={Theme.colors.primaryForeground} /> : null}
      </View>
      <Text
        className={cn(
          'text-sm font-semibold',
          selected ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        Make this Rex private
      </Text>
    </Pressable>
  );
}

export default PrivateRexToggle;
