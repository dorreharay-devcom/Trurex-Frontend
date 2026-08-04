import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { CONNECTION_TAB_LABEL } from '~/features/circles/config/connections';
import { connectionCountLabel } from '~/features/circles/lib/labels';
import type { ConnectionScopeTab, ConnectionsByTab } from '~/features/circles/types/connections';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  tabs: readonly ConnectionScopeTab[];
  active: ConnectionScopeTab;
  onChange: (tab: ConnectionScopeTab) => void;
  byTab: ConnectionsByTab;
};

const ConnectionScopeTabs = ({ tabs, active, onChange, byTab }: Props) => {
  return (
    <View className="mb-4 flex-row flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab === active;
        const count = connectionCountLabel(byTab[tab].rows.length, byTab[tab].hasNextPage);
        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            className={cn(
              'flex-row items-center rounded-xl border px-3 py-2',
              isActive ? 'border-primary bg-accent' : 'border-border bg-search-field',
            )}
          >
            <Text
              className={cn(
                'text-xs font-semibold',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {`${CONNECTION_TAB_LABEL[tab]} · ${count}`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default ConnectionScopeTabs;
