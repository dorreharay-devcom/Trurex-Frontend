import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DeepLinkShell from '~/shared/ui/DeepLinkShell';
import ProtectedRoute from '~/components/common/ProtectedRoute';
import ProfileView from '~/components/profile/ProfileView';
import RecommendationDetailModal from '~/features/rex-detail/ui/RecommendationDetailModal';
import { TAB } from '~/components/layout/TabBar';
import { Routes } from '~/shared/config/routes';
import { useRexPreview } from '~/features/rex-detail/hooks/useRexPreview';
import { isHexUuidString } from '~/utils/guards';

function ProfilePage() {
  const { userId: slug } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const preview = useRexPreview();
  const isUuid = isHexUuidString(slug ?? '');
  const userId = isUuid ? slug : undefined;
  const handle = !isUuid ? slug?.replace(/^@/, '') : undefined;

  const goToMain = useCallback(() => {
    router.replace(Routes.Main);
  }, [router]);

  return (
    <>
      <DeepLinkShell currentTab={TAB.profile} onTabChange={goToMain} onRexPress={preview.openById}>
        <View className="flex-1">
          <ProfileView
            userId={userId}
            handle={handle}
            onBack={goToMain}
            onRexPress={preview.open}
            onSignUp={() => router.navigate(Routes.Login)}
          />
        </View>
      </DeepLinkShell>
      <RecommendationDetailModal
        visible={preview.visible}
        recommendation={preview.recommendation}
        onClose={preview.close}
        onDismiss={preview.clear}
        scrollToComments={preview.options.scrollToComments === true}
        scrollToCommentId={preview.options.scrollToCommentId}
      />
    </>
  );
}

export default function ProtectedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
