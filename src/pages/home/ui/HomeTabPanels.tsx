import React from 'react';
import CirclesPage from '~/features/circles/ui/CirclesPage';
import DiscoverPage from '~/features/discover/ui/DiscoverPage';
import GemsPage from '~/features/gems/ui/GemsPage';
import MapPage from '~/pages/map';
import ProfileView from '~/features/profile/ui/ProfileView';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';

type Props = {
  currentTab: Tab;
  searchQuery: string;
  viewingUserId: string | undefined;
  avatarRefreshKey: number;
  onRecommendationPress: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onUserPress: (userId: string) => void;
  onProfileBack: () => void;
  onAvatarUpdated: () => void;
  onMapRexSheetOpenChange: (open: boolean) => void;
};

function HomeTabPanels({
  currentTab,
  searchQuery,
  viewingUserId,
  avatarRefreshKey,
  onRecommendationPress,
  onUserPress,
  onProfileBack,
  onAvatarUpdated,
  onMapRexSheetOpenChange,
}: Props) {
  if (currentTab === TAB.discover) {
    return <DiscoverPage searchQuery={searchQuery} onRecommendationPress={onRecommendationPress} />;
  }
  if (currentTab === TAB.faves) {
    return <GemsPage onRecommendationPress={onRecommendationPress} />;
  }
  if (currentTab === TAB.circles) {
    return <CirclesPage isActive onUserPress={onUserPress} />;
  }
  if (currentTab === TAB.map) {
    return (
      <MapPage
        onRecommendationPress={onRecommendationPress}
        onRexSheetOpenChange={onMapRexSheetOpenChange}
      />
    );
  }
  return (
    <ProfileView
      userId={viewingUserId}
      onAvatarUpdated={onAvatarUpdated}
      avatarRefreshKey={avatarRefreshKey}
      onBack={viewingUserId ? onProfileBack : undefined}
      onRexPress={onRecommendationPress}
    />
  );
}

export default HomeTabPanels;
