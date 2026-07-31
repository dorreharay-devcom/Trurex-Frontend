import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { StickyTopChromeLayout } from '~/components/layout/StickyTopChromeLayout';
import { TAB } from '~/components/layout/TabBar';
import { useRexPreview } from '~/features/rex-detail/hooks/useRexPreview';
import { useCreateRexModal } from '~/pages/home/hooks/useCreateRexModal';
import { useHomeTabs } from '~/pages/home/hooks/useHomeTabs';
import AddRexFab from '~/pages/home/ui/AddRexFab';
import HomeOverlays from '~/pages/home/ui/HomeOverlays';
import HomeTabPanels from '~/pages/home/ui/HomeTabPanels';
import HomeTopChrome from '~/pages/home/ui/HomeTopChrome';
import type { AddYourOwnRecSource } from '~/features/rex-create';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);
  const [mapRexSheetOpen, setMapRexSheetOpen] = useState(false);
  const tabs = useHomeTabs();
  const create = useCreateRexModal();
  const preview = useRexPreview();

  const handleUserPress = useCallback(
    (userId: string) => {
      preview.close();
      tabs.openUserProfile(userId);
    },
    [preview.close, tabs.openUserProfile],
  );

  const handleAddYourOwn = useCallback(
    (source: AddYourOwnRecSource) => {
      preview.close();
      create.openWithPrefill(source);
    },
    [preview.close, create.openWithPrefill],
  );

  const handleEditRex = useCallback(
    (rexId: string) => {
      preview.close();
      create.openForEdit(rexId);
    },
    [preview.close, create.openForEdit],
  );

  return (
    <View className="min-h-0 flex-1 bg-background">
      <StickyTopChromeLayout
        topChrome={
          <HomeTopChrome
            currentTab={tabs.currentTab}
            searchQuery={searchQuery}
            avatarRefreshKey={avatarRefreshKey}
            onSearchChange={setSearchQuery}
            onTabChange={tabs.changeTab}
            onAddPress={create.openBlank}
            onUserPress={handleUserPress}
            onRexPress={preview.openById}
          />
        }
      >
        <HomeTabPanels
          currentTab={tabs.currentTab}
          searchQuery={searchQuery}
          viewingUserId={tabs.viewingUserId}
          avatarRefreshKey={avatarRefreshKey}
          onRecommendationPress={preview.open}
          onUserPress={handleUserPress}
          onProfileBack={tabs.goBackFromProfile}
          onAvatarUpdated={() => setAvatarRefreshKey((k) => k + 1)}
          onMapRexSheetOpenChange={setMapRexSheetOpen}
        />
      </StickyTopChromeLayout>

      <AddRexFab
        visible={!(tabs.currentTab === TAB.map && mapRexSheetOpen)}
        onPress={create.openBlank}
      />

      <HomeOverlays
        create={create}
        preview={preview}
        onAddYourOwn={handleAddYourOwn}
        onEditRex={handleEditRex}
        onUserPress={handleUserPress}
      />
    </View>
  );
}

export default HomePage;
