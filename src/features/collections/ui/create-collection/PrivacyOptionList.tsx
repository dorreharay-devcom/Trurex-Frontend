import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Check, Globe, Link2, Lock, type LucideIcon } from 'lucide-react-native';
import type { CollectionVisibility } from '~/features/collections/types/collection';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

const PRIVACY_OPTIONS: {
  value: CollectionVisibility;
  label: string;
  desc: string;
  Icon: LucideIcon;
}[] = [
  { value: 'private', label: 'Private', desc: 'Only you can see this', Icon: Lock },
  {
    value: 'shared',
    label: 'Shared',
    desc: 'Share via link or with specific Circles',
    Icon: Link2,
  },
  {
    value: 'public',
    label: 'Public',
    desc: 'Anyone on TruRex can find and follow this',
    Icon: Globe,
  },
];

type Props = {
  value: CollectionVisibility;
  onChange: (value: CollectionVisibility) => void;
};

function PrivacyOptionList({ value, onChange }: Props) {
  return (
    <View>
      <Text className="text-xs font-semibold text-muted-foreground mb-1.5">Privacy setting</Text>
      <View className="gap-2">
        {PRIVACY_OPTIONS.map(({ value: option, label, desc, Icon }) => {
          const selected = value === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              className={cn(
                'w-full rounded-xl border p-3',
                selected ? 'border-primary bg-accent' : 'border-border bg-search-field',
              )}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={cn(
                    'h-8 w-8 items-center justify-center rounded-lg',
                    selected ? 'bg-primary/15' : 'bg-card',
                  )}
                >
                  <Icon
                    size={16}
                    color={selected ? Theme.brand.colorDark : Theme.colors.secondaryText}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{label}</Text>
                  <Text className="text-xs text-muted-foreground">{desc}</Text>
                </View>
                {selected && <Check size={16} color={Theme.brand.colorDark} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default PrivacyOptionList;
