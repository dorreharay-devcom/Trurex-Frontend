import React from 'react';
import { UserX } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { DestructiveActionConfirmModal } from '~/shared/ui/DestructiveActionConfirmModal';

type Props = {
  visible: boolean;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ProfileBlockConfirm = ({ visible, pending, onCancel, onConfirm }: Props) => (
  <DestructiveActionConfirmModal
    visible={visible}
    title="Block this user?"
    message="They won't be able to see your profile activity from your side, and their content will be hidden from your feed. You can unblock them later."
    confirmLabel="Block"
    pending={pending}
    icon={<UserX size={22} color={Theme.colors.destructive} />}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export default ProfileBlockConfirm;
