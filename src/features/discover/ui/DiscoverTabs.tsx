import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DISCOVER_TABS, type DiscoverTab } from '~/features/discover/config/tabs';

type Props = {
  activeTab: DiscoverTab;
  onChange: (tab: DiscoverTab) => void;
};

const DiscoverTabs = ({ activeTab, onChange }: Props) => (
  <View className="flex-row border-b border-border">
    {DISCOVER_TABS.map((tab) => {
      const selected = activeTab === tab.id;
      return (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onChange(tab.id)}
          className="flex-1 items-center gap-1 py-3"
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
        >
          <View className="flex-row items-center gap-1.5">
            <Text style={{ fontSize: 14 }}>{tab.emoji}</Text>
            <Text
              className={`text-xs font-medium ${selected ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {tab.label}
            </Text>
          </View>
          {selected ? <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" /> : null}
        </TouchableOpacity>
      );
    })}
  </View>
);

export default DiscoverTabs;
