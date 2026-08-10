import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Tabs, useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import { TAB, tabFromPathname } from '~/shared/config/mainTabs';
import { toUserRoute } from '~/shared/config/routes';
import { openCreateRex, openRex } from '~/shared/lib/navigation/createRex';
import { openMainTab } from '~/shared/lib/mainTab';
import { firstRouteParam, searchParam } from '~/shared/lib/navigation/routeIds';
import { Theme } from '~/shared/theme/Theme';
import Header from '~/widgets/Header';
import TabBar from '~/widgets/TabBar';
import FrozenAccountBanner from '~/pages/home/ui/FrozenAccountBanner';
import OfflineBanner from '~/pages/home/ui/OfflineBanner';
import AddRexFab from '~/pages/home/ui/AddRexFab';
import {
  AddRexFabChromeProvider,
  useAddRexFabVisible,
} from '~/pages/home/ui/addRexFabChrome';
import { StickyTopChromeLayout } from '~/pages/home/ui/StickyTopChromeLayout';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

function MainTabsChrome() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ q?: string | string[] }>();
  const currentTab = tabFromPathname(pathname);
  const searchQuery = firstRouteParam(params.q) ?? '';
  const fabVisible = useAddRexFabVisible();

  const changeTab = useCallback(
    (tab: typeof currentTab) => {
      openMainTab(router, tab);
    },
    [router],
  );

  const onSearchChange = useCallback(
    (text: string) => {
      router.setParams({ q: searchParam(text.trim() || null) });
    },
    [router],
  );

  const onRexPress = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      openRex(router, rexId, options);
    },
    [router],
  );

  const onUserPress = useCallback(
    (userId: string) => {
      router.push(toUserRoute(userId));
    },
    [router],
  );

  const onAddPress = useCallback(() => {
    openCreateRex(router);
  }, [router]);

  return (
    <View className="min-h-0 flex-1 bg-background">
      <StickyTopChromeLayout
        topChrome={
          <>
            <Header
              searchQuery={searchQuery}
              onSearchChange={currentTab === TAB.discover ? onSearchChange : undefined}
              onProfilePress={() => changeTab(TAB.profile)}
              onAddPress={onAddPress}
              onUserPress={onUserPress}
              onRexPress={onRexPress}
              showSearch={currentTab === TAB.discover}
            />
            <TabBar currentTab={currentTab} onTabChange={changeTab} />
            <OfflineBanner />
            <FrozenAccountBanner />
          </>
        }
      >
        <Tabs
          initialRouteName="discover"
          tabBar={() => null}
          screenOptions={{
            headerShown: false,
            freezeOnBlur: true,
            lazy: true,
            sceneStyle: {
              flex: 1,
              backgroundColor: Theme.colors.background,
            },
          }}
        >
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
          <Tabs.Screen name="gems" options={{ title: 'Gems' }} />
          <Tabs.Screen name="circles" options={{ title: 'Circles' }} />
          <Tabs.Screen name="map" options={{ title: 'Map' }} />
          <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        </Tabs>
      </StickyTopChromeLayout>

      <AddRexFab visible={fabVisible} onPress={onAddPress} />
    </View>
  );
}

export default function MainTabsLayout() {
  return (
    <AddRexFabChromeProvider>
      <MainTabsChrome />
    </AddRexFabChromeProvider>
  );
}
