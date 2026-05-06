import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { Theme } from '~/theme/Theme';
import type { NetworkUserRow } from '~/types/network';

type Props = {
  row: NetworkUserRow;
  onAdd: () => void;
  isMember: boolean;
  isAdding: boolean;
  allowAdd?: boolean;
};

export function CircleConnectionRow({ row, onAdd, isMember, isAdding, allowAdd = true }: Props) {
  const label = row.display_name || 'Member';
  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
      <SignedUserAvatar name={label} avatar={row.avatar_url} className="h-10 w-10" />
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {label}
        </Text>
        {row.handle ? (
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            @{row.handle}
          </Text>
        ) : null}
      </View>
      {allowAdd ? (
        <Pressable
          onPress={onAdd}
          disabled={isMember || isAdding}
          className={`flex-row items-center gap-1 rounded-lg border px-3 py-2 ${
            isMember
              ? 'border-[#d4d4d4cc] bg-[#d4d4d466]'
              : 'border-border bg-background active:opacity-90'
          }`}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color={Theme.colors.primary} />
          ) : isMember ? (
            <Text className="text-xs font-medium" style={{ color: Theme.colors.foreground }}>
              In circle
            </Text>
          ) : (
            <>
              <UserPlus size={14} color={Theme.colors.foreground} />
              <Text className="text-xs font-medium text-foreground">Add to circle</Text>
            </>
          )}
        </Pressable>
      ) : (
        <View className="rounded-full border border-border bg-muted px-2.5 py-1.5">
          <Text className="text-[10px] font-medium text-muted-foreground">Following</Text>
        </View>
      )}
    </View>
  );
}
