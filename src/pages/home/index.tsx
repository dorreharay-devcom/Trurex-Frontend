import React from 'react';
import { View } from 'react-native';
import { StickyTopChromeLayout } from '~/components/layout/StickyTopChromeLayout';
import { TAB } from '~/components/layout/TabBar';
import { useRexPreview } from '~/features/rex-detail/hooks/useRexPreview';
import { useCreateRexModal } from '~/pages/home/hooks/useCreateRexModal';
import { useHomePageState } from '~/pages/home/hooks/useHomePageState';
import { useHomeTabs } from '~/pages/home/hooks/useHomeTabs';
import AddRexFab from '~/pages/home/ui/AddRexFab';
import HomeOverlays from '~/pages/home/ui/HomeOverlays';
import HomeTabPanels from '~/pages/home/ui/HomeTabPanels';
import HomeTopChrome from '~/pages/home/ui/HomeTopChrome';

function HomePage() {
  const tabs = useHomeTabs();
  const create = useCreateRexModal();
  const preview = useRexPreview();
  const page = useHomePageState({ tabs, create, preview });

  const fabVisible = !(tabs.currentTab === TAB.map && page.mapRexSheetOpen);

  return (
    <View className="min-h-0 flex-1 bg-background">
      <StickyTopChromeLayout
        topChrome={
          <HomeTopChrome
            currentTab={tabs.currentTab}
            searchQuery={page.searchQuery}
            avatarRefreshKey={page.avatarRefreshKey}
            onSearchChange={page.setSearchQuery}
            onTabChange={tabs.changeTab}
            onAddPress={create.openBlank}
            onUserPress={page.openUserProfile}
            onRexPress={preview.openById}
          />
        }
      >
        <HomeTabPanels
          currentTab={tabs.currentTab}
          searchQuery={page.searchQuery}
          viewingUserId={tabs.viewingUserId}
          avatarRefreshKey={page.avatarRefreshKey}
          onRecommendationPress={preview.open}
          onUserPress={page.openUserProfile}
          onProfileBack={tabs.goBackFromProfile}
          onAvatarUpdated={page.bumpAvatarRefresh}
          onMapRexSheetOpenChange={page.setMapRexSheetOpen}
        />
      </StickyTopChromeLayout>

      <AddRexFab visible={fabVisible} onPress={create.openBlank} />

      <HomeOverlays
        create={create}
        preview={preview}
        onAddYourOwn={page.addYourOwn}
        onEditRex={page.editRex}
        onUserPress={page.openUserProfile}
      />
    </View>
  );
}

export default HomePage;
