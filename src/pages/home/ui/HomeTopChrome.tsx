import React from 'react';
import { Header } from '~/components/layout/Header';
import { TabBar, TAB, type Tab } from '~/components/layout/TabBar';
import FrozenAccountBanner from '~/pages/home/ui/FrozenAccountBanner';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

type Props = {
  currentTab: Tab;
  searchQuery: string;
  avatarRefreshKey: number;
  onSearchChange: (query: string) => void;
  onTabChange: (tab: Tab) => void;
  onAddPress: () => void;
  onUserPress: (userId: string) => void;
  onRexPress: (rexId: string, options?: RecommendationOpenOptions) => void;
};

function HomeTopChrome({
  currentTab,
  searchQuery,
  avatarRefreshKey,
  onSearchChange,
  onTabChange,
  onAddPress,
  onUserPress,
  onRexPress,
}: Props) {
  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onProfilePress={() => onTabChange(TAB.profile)}
        onAddPress={onAddPress}
        onUserPress={onUserPress}
        onRexPress={onRexPress}
        avatarRefreshKey={avatarRefreshKey}
        showSearch={currentTab === TAB.discover}
      />
      <TabBar currentTab={currentTab} onTabChange={onTabChange} />
      <FrozenAccountBanner />
    </>
  );
}

export default HomeTopChrome;
