import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PROFILE_TAB, PROFILE_TABS, type ProfileTab } from '~/features/profile/config/tabs';

type Props = {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  rexCount: number;
  collectionsCount: number;
  rexRequestsCount: number;
};

function tabLabel(
  tabId: ProfileTab,
  rexCount: number,
  collectionsCount: number,
  rexRequestsCount: number,
): string {
  if (tabId === PROFILE_TAB.recs) return `Rex (${rexCount})`;
  if (tabId === PROFILE_TAB.collections) return `Collections (${collectionsCount})`;
  if (tabId === PROFILE_TAB.rexRequests) return `Requests (${rexRequestsCount})`;
  return tabId;
}

const ProfileTabs = ({
  activeTab,
  onChange,
  rexCount,
  collectionsCount,
  rexRequestsCount,
}: Props) => (
  <View className="flex-row border-b border-border">
    {PROFILE_TABS.map((tab) => {
      const selected = activeTab === tab.id;
      return (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onChange(tab.id)}
          className="flex-1 items-center py-3"
          activeOpacity={0.7}
        >
          <Text
            className={`text-xs font-medium ${selected ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {tabLabel(tab.id, rexCount, collectionsCount, rexRequestsCount)}
          </Text>
          {selected ? <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" /> : null}
        </TouchableOpacity>
      );
    })}
  </View>
);

export default ProfileTabs;
