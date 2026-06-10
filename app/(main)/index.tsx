import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Text, View, TouchableOpacity } from 'react-native';
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
import { useAuth } from '~/services/AuthContext';

type ProfileBackTarget = {
  tab: Tab;
  userId?: string;
};

const WEB_TAB_STORAGE_KEY = 'trurex:last-main-tab';

function isTab(value: unknown): value is Tab {
  return (
    value === 'discover' ||
    value === 'faves' ||
    value === 'circles' ||
    value === 'map' ||
    value === 'profile'
  );
}

function getStoredWebTab(): Tab | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(WEB_TAB_STORAGE_KEY);
    return isTab(stored) ? stored : null;
  } catch {
    return null;
  }
}

export default function HomeScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const initialTab: Tab = isTab(tab) ? tab : (getStoredWebTab() ?? 'discover');
  const [currentTab, setCurrentTab] = useState<Tab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [createRecommendationOpen, setCreateRecommendationOpen] = useState(false);
  const [addYourOwnPrefill, setAddYourOwnPrefill] = useState<AddYourOwnRecSource | null>(null);
  const [editRexId, setEditRexId] = useState<string | null>(null);
  const [previewRecommendation, setPreviewRecommendation] = useState<Recommendation | null>(null);
  const [previewOptions, setPreviewOptions] = useState<RecommendationOpenOptions>({});
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);
  const [viewingUserId, setViewingUserId] = useState<string | undefined>(undefined);
  const [profileBackStack, setProfileBackStack] = useState<ProfileBackTarget[]>([]);
  const { isAccountFrozen } = useUserConfig();
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(WEB_TAB_STORAGE_KEY, currentTab);
    } catch {}
  }, [currentTab]);

  const handleCloseCreate = useCallback(() => {
    setCreateRecommendationOpen(false);
    setAddYourOwnPrefill(null);
    setEditRexId(null);
  }, []);

  const openCreateRex = useCallback(() => {
    setAddYourOwnPrefill(null);
    setEditRexId(null);
    setCreateRecommendationOpen(true);
  }, []);

  const openCreateFromDetail = useCallback((source: AddYourOwnRecSource) => {
    setAddYourOwnPrefill(source);
    setEditRexId(null);
    setCreateRecommendationOpen(true);
    setPreviewRecommendation(null);
    setPreviewOptions({});
  }, []);

  const openEditFromDetail = useCallback((rexId: string) => {
    setEditRexId(rexId);
    setAddYourOwnPrefill(null);
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
      const currentProfileUserId =
        currentTab === 'profile' ? (viewingUserId ?? authUser?.id) : null;
      if (currentProfileUserId === userId) {
        setCurrentTab('profile');
        return;
      }
      setProfileBackStack((stack) => [
        ...stack,
        {
          tab: currentTab,
          userId: currentTab === 'profile' ? viewingUserId : undefined,
        },
      ]);
      setViewingUserId(userId);
      setCurrentTab('profile');
    },
    [authUser?.id, currentTab, viewingUserId],
  );

  const handleCommentCountChange = useCallback((_total: number) => {}, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setProfileBackStack([]);
    if (tab === 'profile') setViewingUserId(undefined);
    setCurrentTab(tab);
  }, []);

  const handleProfileBack = useCallback(() => {
    const target = profileBackStack[profileBackStack.length - 1];
    setProfileBackStack((stack) => stack.slice(0, -1));

    if (!target) {
      setViewingUserId(undefined);
      setCurrentTab('discover');
      return;
    }

    setViewingUserId(target.tab === 'profile' ? target.userId : undefined);
    setCurrentTab(target.tab);
  }, [profileBackStack]);

  return (
    <View className="min-h-0 flex-1 bg-background">
      <StickyTopChromeLayout
        topChrome={
          <>
            <Header
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onProfilePress={() => handleTabChange('profile')}
              onAddPress={openCreateRex}
              onUserPress={openUserProfile}
              avatarRefreshKey={avatarRefreshKey}
              showSearch={currentTab === 'discover'}
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
            avatarRefreshKey={avatarRefreshKey}
            onBack={viewingUserId ? handleProfileBack : undefined}
            onRexPress={openPreview}
          />
        )}
      </StickyTopChromeLayout>

      <TouchableOpacity
        onPress={openCreateRex}
        accessibilityRole="button"
        accessibilityLabel="Add Rex"
        className="absolute bottom-6 w-14 h-14 rounded-full bg-primary items-center justify-center hover:opacity-90 active:opacity-75 cursor-pointer"
        style={{
          right: 24,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        <PlusCircle size={28} color={Theme.colors.primaryForeground} />
      </TouchableOpacity>

      <CreateModal
        visible={createRecommendationOpen}
        onClose={handleCloseCreate}
        addYourOwnPrefill={addYourOwnPrefill}
        editRexId={editRexId}
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
        onEditRex={openEditFromDetail}
      />
    </View>
  );
}
