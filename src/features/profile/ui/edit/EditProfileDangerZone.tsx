import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  blockedCount?: number;
  disabled?: boolean;
  onOpenBlockedUsers: () => void;
  onDeleteAccount: () => void;
};

function blockedCountLabel(count: number | undefined): string {
  if (count == null) return 'Manage people you have blocked';
  if (count === 0) return 'No one blocked';
  return `${count} blocked`;
}

const EditProfileDangerZone = ({
  blockedCount,
  disabled,
  onOpenBlockedUsers,
  onDeleteAccount,
}: Props) => (
  <View className="gap-3 border-t border-border pt-2">
    <TouchableOpacity
      onPress={onOpenBlockedUsers}
      activeOpacity={0.7}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Blocked users"
      className="flex-row items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5 disabled:opacity-50"
    >
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-medium text-foreground">Blocked users</Text>
        <Text className="text-xs text-muted-foreground">{blockedCountLabel(blockedCount)}</Text>
      </View>
      <ChevronRight size={18} color={Theme.colors.muted} />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onDeleteAccount}
      activeOpacity={0.7}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Delete account"
      className="items-center rounded-xl border border-destructive/30 bg-destructive/5 py-3 disabled:opacity-50"
    >
      <Text className="text-sm font-semibold text-destructive">Delete account</Text>
    </TouchableOpacity>
    <Text className="text-center text-[11px] text-muted-foreground">
      Permanently removes your account and all associated data.
    </Text>
  </View>
);

export default EditProfileDangerZone;
