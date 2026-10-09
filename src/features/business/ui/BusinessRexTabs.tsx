import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  networkOnly: boolean;
  onChange: (networkOnly: boolean) => void;
  networkCount: number;
  totalCount: number;
};

function BusinessRexTabs({ networkOnly, onChange, networkCount, totalCount }: Props) {
  const tabs = [
    { networkOnly: false, label: `All Rex's · ${totalCount}` },
    { networkOnly: true, label: `Network · ${networkCount}` },
  ];

  return (
    <View className="flex-row flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.networkOnly === networkOnly;
        return (
          <Pressable
            key={String(tab.networkOnly)}
            onPress={() => onChange(tab.networkOnly)}
            className={cn(
              'flex-row items-center rounded-full border px-3 py-2',
              isActive ? 'border-primary bg-accent' : 'border-border bg-search-field',
            )}
          >
            <Text
              className={cn(
                'text-xs font-semibold',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default BusinessRexTabs;
