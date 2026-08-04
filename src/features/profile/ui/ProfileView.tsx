import React from 'react';
import { KeyboardAvoidingView, ScrollView, useWindowDimensions } from 'react-native';
import { useProfileScreen } from '~/features/profile/hooks/useProfileScreen';
import EditProfile from '~/features/profile/ui/EditProfile';
import ProfileBlockConfirm from '~/features/profile/ui/ProfileBlockConfirm';
import ProfileMainBody from '~/features/profile/ui/ProfileMainBody';
import ProfileNotFound from '~/features/profile/ui/ProfileNotFound';
import ProfileCollectionOverlays from '~/features/profile/ui/collections/ProfileCollectionOverlays';
import { ProfileCardSkeleton } from '~/features/profile/ui/skeleton';
import { KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT } from '~/shared/config/keyboard';
import { isWeb } from '~/shared/lib/ui/platform';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  userId?: string;
  handle?: string;
  onAvatarUpdated?: () => void;
  avatarRefreshKey?: number;
  onBack?: () => void;
  onRexPress?: (rec: Recommendation) => void;
};

const ProfileView = ({
  userId,
  handle,
  onAvatarUpdated,
  avatarRefreshKey = 0,
  onBack,
  onRexPress,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const flow = useProfileScreen({
    userId,
    handle,
    onAvatarUpdated,
    onBack,
    onRexPress,
  });
  const { social, collectionOverlay } = flow;

  if (flow.loading || flow.awaitingHandleProfile) {
    return <ProfileCardSkeleton windowWidth={windowWidth} showBack={Boolean(onBack)} />;
  }

  if (flow.notFound) {
    return <ProfileNotFound onBack={onBack} />;
  }

  if (flow.isEditing) {
    return (
      <KeyboardAvoidingView
        behavior={KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT}
        className="min-h-0 flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={webContainerStyle}
          contentContainerClassName="p-4 pb-40"
        >
          <EditProfile onClose={flow.closeEdit} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (collectionOverlay.openCollectionId && !isWeb) {
    return <ProfileCollectionOverlays {...collectionOverlay} fullscreen />;
  }

  return (
    <>
      <ProfileMainBody flow={flow} avatarRefreshKey={avatarRefreshKey} onBack={onBack} />
      <ProfileCollectionOverlays {...collectionOverlay} />
      <ProfileBlockConfirm
        visible={social.showBlockConfirm}
        pending={social.blockPendingConfirm}
        onCancel={social.closeBlockConfirm}
        onConfirm={social.onConfirmBlock}
      />
    </>
  );
};

export default ProfileView;
