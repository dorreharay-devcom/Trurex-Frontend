import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DeepLinkShell from '~/shared/ui/DeepLinkShell';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import ProfileView from '~/features/profile/ui/ProfileView';
import RecommendationDetailModal from '~/features/rex-detail/ui/RecommendationDetailModal';
import { TAB } from '~/shared/ui/shell/TabBar';
import { Routes } from '~/shared/config/routes';
import { useRexPreview } from '~/features/rex-detail/hooks/useRexPreview';
import { isHexUuidString } from '~/utils/guards';

type ProfileTarget = { userId?: string; handle?: string };

function parseProfileSlug(slug: string | undefined): ProfileTarget {
  if (!slug) return {};
  if (isHexUuidString(slug)) return { userId: slug };
  return { handle: slug.replace(/^@/, '') };
}

function ProfilePage() {
  const { userId: slug } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const preview = useRexPreview();
  const { userId, handle } = parseProfileSlug(slug);

  const goToMain = useCallback(() => {
    router.replace(Routes.Main);
  }, [router]);

  const goToLogin = useCallback(() => {
    router.navigate(Routes.Login);
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
            onSignUp={goToLogin}
          />
        </View>
      </DeepLinkShell>
      <RecommendationDetailModal
        visible={preview.visible}
        recommendation={preview.recommendation}
        onClose={preview.close}
        onDismiss={preview.clear}
        scrollToComments={preview.options.scrollToComments}
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
