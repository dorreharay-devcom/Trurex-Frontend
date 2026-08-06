import React from 'react';
import Header from '~/widgets/Header';
import TabBar from '~/widgets/TabBar';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import FrozenAccountBanner from '~/pages/home/ui/FrozenAccountBanner';
import OfflineBanner from '~/pages/home/ui/OfflineBanner';
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
      <OfflineBanner />
      <FrozenAccountBanner />
    </>
  );
}

export default HomeTopChrome;
