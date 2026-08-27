import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

const AudienceFilterRow = ({ label, selected, onToggle }: Props) => (
  <Pressable
    onPress={onToggle}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: selected }}
    accessibilityLabel={label}
    className="flex-row items-center justify-between py-3.5"
  >
    <Text className="text-sm text-foreground">{label}</Text>
    <View
      className={cn(
        'h-5 w-5 items-center justify-center rounded-md border-2',
        selected ? 'border-primary bg-primary' : 'border-border bg-transparent',
      )}
    >
      {selected ? <Check size={13} color={Theme.colors.background} strokeWidth={3} /> : null}
    </View>
  </Pressable>
);

export default AudienceFilterRow;
