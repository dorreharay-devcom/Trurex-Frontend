import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Globe, Lock, Users, type LucideIcon } from 'lucide-react-native';
import type { CollectionVisibility } from '~/features/collections/types/collection';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

const VISIBILITY_OPTIONS: {
  value: CollectionVisibility;
  label: string;
  sublabel: string;
  Icon: LucideIcon;
}[] = [
  { value: 'private', label: 'Private', sublabel: 'Only you', Icon: Lock },
  { value: 'shared', label: 'Circles', sublabel: 'Your circles', Icon: Users },
  { value: 'public', label: 'Public', sublabel: 'Everyone', Icon: Globe },
];

type Props = {
  value: CollectionVisibility;
  onChange: (value: CollectionVisibility) => void;
};

function VisibilityToggleRow({ value, onChange }: Props) {
  return (
    <View>
      <Text className="text-xs font-semibold text-muted-foreground mb-1.5">Visibility</Text>
      <View className="flex-row gap-2">
        {VISIBILITY_OPTIONS.map(({ value: option, label, sublabel, Icon }) => {
          const active = value === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              activeOpacity={0.7}
              className={cn(
                'flex-1 items-center py-3 rounded-xl border',
                active ? 'border-primary bg-accent' : 'border-border bg-search-field',
              )}
            >
              <Icon size={16} color={active ? Theme.brand.colorDark : Theme.colors.secondaryText} />
              <Text className="mt-1 text-xs font-semibold text-foreground">{label}</Text>
              <Text className="mt-0.5 text-[10px] text-muted-foreground">{sublabel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default VisibilityToggleRow;
