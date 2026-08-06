import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useEditProfile } from '~/features/profile/hooks/edit/useEditProfile';
import EditProfileAvatar from '~/features/profile/ui/edit/EditProfileAvatar';
import EditProfileBasics from '~/features/profile/ui/edit/EditProfileBasics';
import EditProfileCurrently from '~/features/profile/ui/edit/EditProfileCurrently';
import EditProfileDangerZone from '~/features/profile/ui/edit/EditProfileDangerZone';
import { Theme } from '~/shared/theme/Theme';
import { Button } from '~/shared/ui/primitives/Button';
import DestructiveActionConfirmModal from '~/shared/ui/destructive-confirm/DestructiveActionConfirmModal';

type Props = {
  onClose: () => void;
  onOpenBlockedUsers: () => void;
};

const EditProfile = ({ onClose, onOpenBlockedUsers }: Props) => {
  const form = useEditProfile({ onClose });
  const { fields, avatar, blocked, account } = form;

  if (form.loading) {
    return (
      <View className="h-96 items-center justify-center">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  const actionsDisabled = form.saving || account.pending;

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="rounded-lg p-1.5"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft size={20} color={Theme.colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-foreground">Edit Profile</Text>
        </View>
        <Button
          title="Save"
          onPress={() => void form.save()}
          loading={form.saving}
          disabled={form.saving}
          className="px-4 py-2"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerClassName="gap-6 py-6"
      >
        <EditProfileAvatar
          displayName={fields.displayName}
          pendingAvatar={avatar.pending}
          currentAvatarUrl={avatar.currentUrl}
          uploading={avatar.uploading}
          onPick={() => void avatar.pick()}
          onClear={avatar.clear}
        />

        <EditProfileBasics
          displayName={fields.displayName}
          onDisplayNameChange={fields.setDisplayName}
          handle={fields.handle}
          onHandleChange={fields.setHandle}
          bio={fields.bio}
          onBioChange={fields.setBio}
          location={fields.location}
          onLocationChange={fields.setLocation}
        />

        <EditProfileCurrently
          currently={fields.currently}
          onChangeField={fields.setCurrentlyField}
        />

        <EditProfileDangerZone
          blockedCount={blocked.count}
          disabled={actionsDisabled}
          onOpenBlockedUsers={onOpenBlockedUsers}
          onDeleteAccount={account.openConfirm}
        />
      </ScrollView>

      <DestructiveActionConfirmModal
        visible={account.confirmVisible}
        title="Delete your account?"
        message="This will permanently delete your account, rexes, collections, and all other data. This action cannot be undone."
        confirmLabel="Delete account"
        pending={account.pending}
        onCancel={account.closeConfirm}
        onConfirm={() => void account.confirm()}
      />
    </View>
  );
};

export default EditProfile;
