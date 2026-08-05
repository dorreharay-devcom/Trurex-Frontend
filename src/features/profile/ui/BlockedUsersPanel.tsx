import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useBlockedUsersPanel } from '~/features/profile/hooks/edit/useBlockedUsersPanel';
import { formatProfileHandle } from '~/features/profile/lib/handle';
import type { BlockedUserRow } from '~/features/profile/types/blockedUser';
import { Theme } from '~/shared/theme/Theme';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';

type Props = {
  onBack: () => void;
};

type RowProps = {
  row: BlockedUserRow;
  busy: boolean;
  disabled: boolean;
  onUnblock: () => void;
};

function BlockedUserRowItem({ row, busy, disabled, onUnblock }: RowProps) {
  const label = row.display_name || 'Member';
  const handle = formatProfileHandle(row.handle);

  return (
    <View className="flex-row items-center gap-3 rounded-xl px-2 py-2.5">
      <SignedUserAvatar name={label} avatar={row.avatar_url} className="h-10 w-10" />
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {label}
        </Text>
        {handle ? (
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {handle}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={onUnblock}
        activeOpacity={0.7}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Unblock ${label}`}
        className="min-w-[84px] items-center justify-center rounded-lg border border-border px-3 py-2 disabled:opacity-50"
      >
        {busy ? (
          <ActivityIndicator size="small" color={Theme.colors.foreground} />
        ) : (
          <Text className="text-sm font-medium text-foreground">Unblock</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

type Panel = ReturnType<typeof useBlockedUsersPanel>;

function BlockedUsersPanelBody({ panel }: { panel: Panel }) {
  if (panel.isLoading) {
    return (
      <View className="items-center justify-center py-16">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  if (panel.isError) {
    return (
      <View className="items-center gap-3 px-6 py-16">
        <Text className="text-center text-sm text-muted-foreground">
          Couldn't load blocked users.
        </Text>
        <TouchableOpacity
          onPress={() => void panel.refetch()}
          activeOpacity={0.7}
          className="rounded-lg border border-border px-4 py-2"
        >
          <Text className="text-sm font-medium text-foreground">
            {panel.isFetching ? 'Retrying…' : 'Try again'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (panel.rows.length === 0) {
    return (
      <View className="items-center gap-1 px-6 py-16">
        <Text className="text-sm font-medium text-foreground">No blocked users</Text>
        <Text className="text-center text-xs text-muted-foreground">
          People you block will appear here. You can unblock them anytime.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-1 px-4 py-3">
      {panel.rows.map((row) => {
        const busy = panel.pendingUserId === row.user_id;
        return (
          <BlockedUserRowItem
            key={row.user_id}
            row={row}
            busy={busy}
            disabled={panel.anyUnblockPending}
            onUnblock={() => panel.unblockUser(row.user_id)}
          />
        );
      })}
    </ScrollView>
  );
}

function BlockedUsersPanel({ onBack }: Props) {
  const panel = useBlockedUsersPanel();

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <View className="flex-row items-center gap-3 border-b border-border px-4 py-4">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="rounded-lg p-1.5"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={Theme.colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Blocked users</Text>
      </View>
      <BlockedUsersPanelBody panel={panel} />
    </View>
  );
}

export default BlockedUsersPanel;
