import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProfileView from '~/components/profile/ProfileView';
import { Header } from '~/components/layout/Header';
import { TabBar, Tab } from '~/components/layout/TabBar';
import RecommendationDetailModal from '~/features/rex-detail/ui/RecommendationDetailModal';
import ProtectedRoute from '~/components/common/ProtectedRoute';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { recommendationStubFromId } from '~/features/rex-detail/lib/rexDetailToRecommendation';
import { isHexUuidString } from '~/utils/guards';

export default function UserProfilePage() {
  const { userId: slug } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const isUuid = isHexUuidString(slug ?? '');
  const userId = isUuid ? slug : undefined;
  const handle = !isUuid ? slug?.replace(/^@/, '') : undefined;
  const [avatarRefreshKey] = useState(0);
  const [previewRecommendation, setPreviewRecommendation] = useState<Recommendation | null>(null);
  const [previewOptions, setPreviewOptions] = useState<RecommendationOpenOptions>({});

  const handleTabChange = useCallback(
    (_tab: Tab) => {
      router.replace('/');
    },
    [router],
  );

  const openPreview = useCallback((rec: Recommendation, options?: RecommendationOpenOptions) => {
    setPreviewOptions(options ?? {});
    setPreviewRecommendation(rec);
  }, []);

  const openRexById = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      openPreview(recommendationStubFromId(rexId), options);
    },
    [openPreview],
  );

  const closePreview = useCallback(() => {
    setPreviewRecommendation(null);
    setPreviewOptions({});
  }, []);

  return (
    <ProtectedRoute>
      <SafeAreaProvider>
        <View className="flex-1 bg-background">
          <Header
            searchQuery=""
            onSearchChange={() => {}}
            onProfilePress={() => handleTabChange('profile')}
            onAddPress={() => {}}
            onUserPress={(id) => router.replace(`/user/${id}`)}
            onRexPress={openRexById}
            avatarRefreshKey={avatarRefreshKey}
            showSearch={false}
          />
          <TabBar currentTab="profile" onTabChange={handleTabChange} />
          <View className="flex-1">
            <ProfileView
              userId={userId}
              handle={handle}
              onBack={() => router.replace('/')}
              onRexPress={openPreview}
              onSignUp={() => router.navigate('/(auth)/login')}
            />
          </View>
        </View>

        <RecommendationDetailModal
          visible={previewRecommendation != null}
          recommendation={previewRecommendation}
          onClose={closePreview}
          scrollToComments={previewOptions.scrollToComments === true}
          scrollToCommentId={previewOptions.scrollToCommentId}
        />
      </SafeAreaProvider>
    </ProtectedRoute>
  );
}
