import React, { useCallback, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PlusCircle } from 'lucide-react-native';
import ProfileView from '~/components/profile/ProfileView';
import FavesView from '~/components/faves/FavesView';
import DiscoverView from '~/components/discover/DiscoverView';
import MapScreen from '~/components/map/MapScreen';
import CirclesView from '~/components/circles/CirclesView';
import { Header } from '~/components/layout/Header';
import { StickyTopChromeLayout } from '~/components/layout/StickyTopChromeLayout';
import { TabBar, Tab } from '~/components/layout/TabBar';
import { CreateModal } from '~/components/recommendation/create/CreateModal';
import { RecommendationDetailModal } from '~/components/recommendation/RecommendationDetailModal';
import { Theme } from '~/theme/Theme';
import type { AddYourOwnRecSource } from '~/utils/recommendation/recCreateFlow';
import type {
  Recommendation,
  RecommendationOpenOptions,
} from '~/types/recommendation/recommendation';
import { useUserConfig } from '~/hooks/useUserConfig';

export default function HomeScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const initialTab: Tab =
    tab === 'faves' || tab === 'circles' || tab === 'map' || tab === 'profile' ? tab : 'discover';
  const [currentTab, setCurrentTab] = useState<Tab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [createRecommendationOpen, setCreateRecommendationOpen] = useState(false);
  const [addYourOwnPrefill, setAddYourOwnPrefill] = useState<AddYourOwnRecSource | null>(null);
  const [previewRecommendation, setPreviewRecommendation] = useState<Recommendation | null>(null);
  const [previewOptions, setPreviewOptions] = useState<RecommendationOpenOptions>({});
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);
  const [viewingUserId, setViewingUserId] = useState<string | undefined>(undefined);
  const [profileReturnTab, setProfileReturnTab] = useState<Tab>('discover');
  const { isAccountFrozen } = useUserConfig();

  const handleCloseCreate = useCallback(() => {
    setCreateRecommendationOpen(false);
    setAddYourOwnPrefill(null);
  }, []);

  const openCreateFromDetail = useCallback((source: AddYourOwnRecSource) => {
    setAddYourOwnPrefill(source);
    setCreateRecommendationOpen(true);
    setPreviewRecommendation(null);
    setPreviewOptions({});
  }, []);

  const openPreview = useCallback((rec: Recommendation, options?: RecommendationOpenOptions) => {
    setPreviewOptions(options ?? {});
    setPreviewRecommendation(rec);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewRecommendation(null);
    setPreviewOptions({});
  }, []);

  const openUserProfile = useCallback(
    (userId: string) => {
      setPreviewRecommendation(null);
      setPreviewOptions({});
      setViewingUserId(userId);
      setProfileReturnTab((prev) => (currentTab !== 'profile' ? currentTab : prev));
      setCurrentTab('profile');
    },
    [currentTab],
  );

  const handleCommentCountChange = useCallback((_total: number) => {}, []);

  const handleTabChange = useCallback((tab: Tab) => {
    if (tab === 'profile') setViewingUserId(undefined);
    setCurrentTab(tab);
  }, []);

  return (
    <View className="min-h-0 flex-1 bg-background">
      <StickyTopChromeLayout
        topChrome={
          <>
            <Header
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onProfilePress={() => handleTabChange('profile')}
              onAddPress={() => setCreateRecommendationOpen(true)}
              onUserPress={openUserProfile}
              avatarRefreshKey={avatarRefreshKey}
            />
            <TabBar currentTab={currentTab} onTabChange={handleTabChange} />
            {isAccountFrozen ? (
              <View className="w-full items-center bg-primary/45 px-4 py-3">
                <Text className="text-base font-bold text-primary-foreground">
                  ❗ Your account is frozen by the admin
                </Text>
              </View>
            ) : null}
          </>
        }
      >
        {currentTab === 'discover' && (
          <DiscoverView searchQuery={searchQuery} onRecommendationPress={openPreview} />
        )}
        {currentTab === 'faves' && (
          <FavesView commentCountByRexId={{}} onRecommendationPress={openPreview} />
        )}
        {currentTab === 'circles' && (
          <CirclesView isActive={currentTab === 'circles'} onUserPress={openUserProfile} />
        )}
        {currentTab === 'map' && <MapScreen onRecommendationPress={openPreview} />}
        {currentTab === 'profile' && (
          <ProfileView
            userId={viewingUserId}
            onAvatarUpdated={() => setAvatarRefreshKey((k) => k + 1)}
            onBack={
              viewingUserId
                ? () => {
                    setViewingUserId(undefined);
                    setCurrentTab(profileReturnTab);
                  }
                : undefined
            }
            onRexPress={openPreview}
          />
        )}
      </StickyTopChromeLayout>

      {currentTab === 'discover' && (
        <TouchableOpacity
          onPress={() => {
            setAddYourOwnPrefill(null);
            setCreateRecommendationOpen(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Add Rex"
          className="absolute right-6 bottom-6 w-14 h-14 rounded-full bg-primary items-center justify-center hover:opacity-90 active:opacity-75 cursor-pointer"
          style={{
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <PlusCircle size={28} color={Theme.colors.primaryForeground} />
        </TouchableOpacity>
      )}

      <CreateModal
        visible={createRecommendationOpen}
        onClose={handleCloseCreate}
        addYourOwnPrefill={addYourOwnPrefill}
      />

      <RecommendationDetailModal
        visible={previewRecommendation != null}
        recommendation={previewRecommendation}
        onClose={closePreview}
        onAddYourOwn={openCreateFromDetail}
        onCommentCountChange={handleCommentCountChange}
        scrollToComments={previewOptions.scrollToComments === true}
        onAuthorPress={openUserProfile}
        onUserPress={openUserProfile}
      />
    </View>
  );
}
