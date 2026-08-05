import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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

function panelStyle(active: boolean) {
  return active ? styles.activePanel : styles.hiddenPanel;
}

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
  const [visited, setVisited] = useState<ReadonlySet<Tab>>(() => new Set([currentTab]));

  useEffect(() => {
    setVisited((prev) => {
      if (prev.has(currentTab)) return prev;
      const next = new Set(prev);
      next.add(currentTab);
      return next;
    });
  }, [currentTab]);

  return (
    <View style={styles.root}>
      {visited.has(TAB.discover) ? (
        <View
          style={panelStyle(currentTab === TAB.discover)}
          pointerEvents={currentTab === TAB.discover ? 'auto' : 'none'}
          collapsable={false}
        >
          <DiscoverPage searchQuery={searchQuery} onRecommendationPress={onRecommendationPress} />
        </View>
      ) : null}

      {visited.has(TAB.faves) ? (
        <View
          style={panelStyle(currentTab === TAB.faves)}
          pointerEvents={currentTab === TAB.faves ? 'auto' : 'none'}
          collapsable={false}
        >
          <GemsPage onRecommendationPress={onRecommendationPress} />
        </View>
      ) : null}

      {visited.has(TAB.circles) ? (
        <View
          style={panelStyle(currentTab === TAB.circles)}
          pointerEvents={currentTab === TAB.circles ? 'auto' : 'none'}
          collapsable={false}
        >
          <CirclesPage isActive={currentTab === TAB.circles} onUserPress={onUserPress} />
        </View>
      ) : null}

      {visited.has(TAB.map) ? (
        <View
          style={panelStyle(currentTab === TAB.map)}
          pointerEvents={currentTab === TAB.map ? 'auto' : 'none'}
          collapsable={false}
        >
          <MapPage
            onRecommendationPress={onRecommendationPress}
            onRexSheetOpenChange={onMapRexSheetOpenChange}
          />
        </View>
      ) : null}

      {visited.has(TAB.profile) ? (
        <View
          style={panelStyle(currentTab === TAB.profile)}
          pointerEvents={currentTab === TAB.profile ? 'auto' : 'none'}
          collapsable={false}
        >
          <ProfileView
            userId={viewingUserId}
            onAvatarUpdated={onAvatarUpdated}
            avatarRefreshKey={avatarRefreshKey}
            onBack={viewingUserId ? onProfileBack : undefined}
            onRexPress={onRecommendationPress}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
  },
  activePanel: {
    flex: 1,
    minHeight: 0,
  },
  hiddenPanel: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    zIndex: -1,
  },
});

export default HomeTabPanels;
