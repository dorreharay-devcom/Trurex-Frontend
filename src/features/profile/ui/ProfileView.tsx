import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useProfileScreen } from '~/features/profile/hooks/useProfileScreen';
import ProfileBlockConfirm from '~/features/profile/ui/ProfileBlockConfirm';
import ProfileMainBody from '~/features/profile/ui/ProfileMainBody';
import ProfileNotFound from '~/features/profile/ui/ProfileNotFound';
import ProfileLoadError from '~/features/profile/ui/ProfileLoadError';
import { ProfileCardSkeleton } from '~/features/profile/ui/skeleton';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  userId?: string;
  handle?: string;
  onAvatarUpdated?: () => void;
  avatarRefreshKey?: number;
  onBack?: () => void;
  onRexPress?: (rec: Recommendation) => void;
  onEditProfile?: () => void;
  onOpenCollection?: (collectionId: string) => void;
};

const ProfileView = ({
  userId,
  handle,
  onAvatarUpdated,
  avatarRefreshKey = 0,
  onBack,
  onRexPress,
  onEditProfile,
  onOpenCollection,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const flow = useProfileScreen({
    userId,
    handle,
    onAvatarUpdated,
    onBack,
    onRexPress,
    onEditProfile,
    onOpenCollection,
  });
  const { social } = flow;

  if (flow.loading || flow.awaitingHandleProfile) {
    return <ProfileCardSkeleton windowWidth={windowWidth} showBack={Boolean(onBack)} />;
  }

  if (flow.notFound) {
    return <ProfileNotFound onBack={onBack} />;
  }

  if (flow.isError) {
    return <ProfileLoadError onBack={onBack} onRetry={flow.retryProfile} />;
  }

  return (
    <>
      <ProfileMainBody flow={flow} avatarRefreshKey={avatarRefreshKey} onBack={onBack} />
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
