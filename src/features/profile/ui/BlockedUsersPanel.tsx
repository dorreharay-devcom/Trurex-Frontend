import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { unblockUser } from '~/shared/api/moderationApi';
import type { BlockedUserRow } from '~/types/moderation';
import { SignedUserAvatar } from '~/shared/ui/SignedUserAvatar';
import { Theme } from '~/shared/theme/Theme';
import { toastError, toastSuccess } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';
import { blockedUsersQueryKey, useBlockedUsers } from '~/hooks/useBlockUser';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

type Props = {
  onBack: () => void;
};

function formatHandle(handle: string | null): string | null {
  if (!handle) return null;
  return handle.startsWith('@') ? handle : `@${handle}`;
}

export function BlockedUsersPanel({ onBack }: Props) {
  const { user } = useAuth();
  const viewerId = user?.id;
  const queryClient = useQueryClient();
  const {
    data: blockedUsers = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useBlockedUsers(viewerId);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const unblock = useMutation({
    mutationFn: (targetUserId: string) => unblockUser(targetUserId),
    onMutate: (targetUserId) => {
      setPendingUserId(targetUserId);
    },
    onSuccess: (_data, targetUserId) => {
      if (viewerId) {
        queryClient.setQueryData<BlockedUserRow[]>(blockedUsersQueryKey(viewerId), (prev) =>
          (prev ?? []).filter((row) => row.user_id !== targetUserId),
        );
        void queryClient.invalidateQueries({ queryKey: blockedUsersQueryKey(viewerId) });
      }
      void queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.discoverFeed });
      toastSuccess('User unblocked');
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError(unknownErrorMessage(e, 'Failed to unblock user'));
    },
    onSettled: () => {
      setPendingUserId(null);
    },
  });

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

      {isLoading ? (
        <View className="items-center justify-center py-16">
          <ActivityIndicator color={Theme.colors.primary} />
        </View>
      ) : isError ? (
        <View className="items-center gap-3 px-6 py-16">
          <Text className="text-center text-sm text-muted-foreground">
            Couldn't load blocked users.
          </Text>
          <TouchableOpacity
            onPress={() => void refetch()}
            activeOpacity={0.7}
            className="rounded-lg border border-border px-4 py-2"
          >
            <Text className="text-sm font-medium text-foreground">
              {isFetching ? 'Retrying…' : 'Try again'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : blockedUsers.length === 0 ? (
        <View className="items-center gap-1 px-6 py-16">
          <Text className="text-sm font-medium text-foreground">No blocked users</Text>
          <Text className="text-center text-xs text-muted-foreground">
            People you block will appear here. You can unblock them anytime.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 py-3 gap-1"
        >
          {blockedUsers.map((row) => {
            const label = row.display_name || 'Member';
            const handle = formatHandle(row.handle);
            const busy = pendingUserId === row.user_id;

            return (
              <View
                key={row.user_id}
                className="flex-row items-center gap-3 rounded-xl px-2 py-2.5"
              >
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
                <Pressable
                  onPress={() => unblock.mutate(row.user_id)}
                  disabled={busy || unblock.isPending}
                  accessibilityRole="button"
                  accessibilityLabel={`Unblock ${label}`}
                  className="min-w-[84px] items-center justify-center rounded-lg border border-border px-3 py-2 disabled:opacity-50"
                >
                  {busy ? (
                    <ActivityIndicator size="small" color={Theme.colors.foreground} />
                  ) : (
                    <Text className="text-sm font-medium text-foreground">Unblock</Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

type BlockedUsersEntryProps = {
  onPress: () => void;
  disabled?: boolean;
  count?: number;
};

export function BlockedUsersEntryRow({ onPress, disabled, count }: BlockedUsersEntryProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Blocked users"
      className="flex-row items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5 disabled:opacity-50"
    >
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-medium text-foreground">Blocked users</Text>
        <Text className="text-xs text-muted-foreground">
          {typeof count === 'number'
            ? count === 0
              ? 'No one blocked'
              : `${count} blocked`
            : 'Manage people you have blocked'}
        </Text>
      </View>
      <ChevronRight size={18} color={Theme.colors.muted} />
    </TouchableOpacity>
  );
}
