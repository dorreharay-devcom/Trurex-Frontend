import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useAuth } from '~/features/auth/providers';
import { useCircleDetail } from '~/features/circles/hooks/detail/useCircleDetail';
import { useDeleteCircle } from '~/features/circles/hooks/detail/useDeleteCircle';
import { useEditCircle } from '~/features/circles/hooks/detail/useEditCircle';
import { useCircleMembers } from '~/features/circles/hooks/data/useCircleMembers';
import { useCircleMembership } from '~/features/circles/hooks/useCircleMembership';
import {
  DELETE_CIRCLE_CONFIRM_MESSAGE,
  canEditOrDeleteUserCircle,
  getCircleUiPolicy,
} from '~/features/circles/lib/circlePolicy';
import AddToCircleSection from '~/features/circles/ui/detail/AddToCircleSection';
import CircleSummaryHeader from '~/features/circles/ui/detail/CircleSummaryHeader';
import DetailToolbar from '~/features/circles/ui/detail/DetailToolbar';
import EditCircleModal from '~/features/circles/ui/detail/EditCircleModal';
import MembersSection from '~/features/circles/ui/detail/MembersSection';
import { webContainerStyle } from '~/utils';
import { DestructiveActionConfirmModal } from '~/shared/ui/DestructiveActionConfirmModal';

type Props = {
  circleId: string;
  onBack: () => void;
  onUserPress?: (userId: string) => void;
};

const CircleDetailScreen = ({ circleId, onBack, onUserPress }: Props) => {
  const { user } = useAuth();
  const { circle, displayRow } = useCircleDetail(circleId, Boolean(user), onBack);
  const { members, loading: membersLoading } = useCircleMembers(circleId, Boolean(user));
  const membership = useCircleMembership(circleId);
  const edit = useEditCircle(circle);
  const remove = useDeleteCircle(circle, onBack);

  const memberIds = useMemo(() => new Set(members.map((m) => m.user_id)), [members]);
  const listedMembers = useMemo(
    () => (user ? members.filter((m) => m.user_id !== user.id) : members),
    [members, user],
  );

  if (!circle || !displayRow) return null;

  const policy = getCircleUiPolicy(circle);
  const canManage = canEditOrDeleteUserCircle(circle, user?.id);
  const canRemoveMembers = Boolean(
    user && circle.owner_id === user.id && policy.allowOwnerRemoveMemberRpc,
  );

  return (
    <>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="w-full p-4 pb-24"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <DetailToolbar
          canManage={canManage}
          deletePending={remove.pending}
          deleteModalOpen={remove.confirmOpen}
          onBack={onBack}
          onEdit={edit.openForCircle}
          onDelete={remove.request}
        />

        <CircleSummaryHeader circle={circle} displayRow={displayRow} memberCount={listedMembers.length} />

        <MembersSection
          members={listedMembers}
          loading={membersLoading}
          canRemove={canRemoveMembers}
          removingMemberId={membership.removingMemberId}
          onRemove={membership.removeMember}
          onUserPress={onUserPress}
        />

        {policy.showConnectionsAddPanel && (
          <AddToCircleSection
            userId={user?.id}
            memberIds={memberIds}
            addingMemberId={membership.addingMemberId}
            onAddMember={membership.addMember}
            onUserPress={onUserPress}
          />
        )}
      </ScrollView>

      <EditCircleModal edit={edit} />

      <DestructiveActionConfirmModal
        visible={remove.confirmOpen}
        title="Delete circle?"
        message={DELETE_CIRCLE_CONFIRM_MESSAGE}
        confirmLabel="Delete"
        pending={remove.pending}
        onCancel={remove.dismiss}
        onConfirm={remove.commit}
      />
    </>
  );
};

export default CircleDetailScreen;
