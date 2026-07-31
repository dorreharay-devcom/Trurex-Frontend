import React from 'react';
import CirclesView from '~/components/circles/CirclesView';
import GemsPage from '~/pages/gems';
import MapScreen from '~/components/map/MapScreen';
import ProfileView from '~/components/profile/ProfileView';
import { TAB, type Tab } from '~/components/layout/TabBar';
import DiscoverPage from '~/pages/discover';
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
    return <CirclesView isActive onUserPress={onUserPress} />;
  }
  if (currentTab === TAB.map) {
    return (
      <MapScreen
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
