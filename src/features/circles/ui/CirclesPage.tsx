import React from 'react';
import { ScrollView } from 'react-native';
import { useAuth } from '~/features/auth/providers';
import CircleAssignmentSheet from '~/features/circles/ui/assignment/CircleAssignmentSheet';
import CircleDetailScreen from '~/features/circles/ui/detail/CircleDetailScreen';
import ShareProfileCard from '~/features/circles/ui/ShareProfileCard';
import { useCirclesPageState } from '~/features/circles/hooks/useCirclesPageState';
import ConnectionsSection from '~/features/circles/ui/ConnectionsSection';
import MyCirclesSection from '~/features/circles/ui/MyCirclesSection';
import { webContainerStyle } from '~/shared/lib/ui/styles';

const SHOW_SHARE_PROFILE_CARD = false;

type Props = {
  isActive: boolean;
  onUserPress?: (userId: string) => void;
};

const CirclesPage = ({ isActive, onUserPress }: Props) => {
  const { user } = useAuth();
  const page = useCirclesPageState();

  if (page.openCircleId) {
    return (
      <CircleDetailScreen
        circleId={page.openCircleId}
        onBack={page.closeCircle}
        onUserPress={onUserPress}
      />
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="w-full p-4 pb-24"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {SHOW_SHARE_PROFILE_CARD && <ShareProfileCard isActive={isActive} />}

        <MyCirclesSection enabled={Boolean(user) && isActive} onOpenCircle={page.openCircle} />

        {user && isActive && (
          <ConnectionsSection
            userId={user.id}
            onUserPress={onUserPress}
            onAddToCircle={page.openAssign}
          />
        )}
      </ScrollView>

      <CircleAssignmentSheet
        open={page.assignTarget != null}
        onClose={page.closeAssign}
        memberId={page.assignTarget?.id ?? ''}
        memberName={page.assignTarget?.name ?? ''}
      />
    </>
  );
};

export default CirclesPage;
