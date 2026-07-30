import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight, PlusCircle } from 'lucide-react-native';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { Theme } from '~/shared/theme/Theme';
import type { NetworkUserRow } from '~/types/network';

type Props = {
  row: NetworkUserRow;
  onAddToCircle?: () => void;
  allowAddToCircle?: boolean;
  onUserPress?: (userId: string) => void;
};

export function NetworkConnectionRow({
  row,
  onAddToCircle,
  allowAddToCircle = true,
  onUserPress,
}: Props) {
  const label = row.display_name || 'Member';

  const profileBody = (
    <>
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
    </>
  );

  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
      {onUserPress ? (
        <Pressable
          onPress={() => onUserPress(row.user_id)}
          accessibilityRole="button"
          accessibilityLabel={`View ${label}'s profile`}
          className="min-w-0 flex-1 flex-row items-center gap-3 rounded-lg active:opacity-70"
        >
          {profileBody}
        </Pressable>
      ) : (
        <View className="min-w-0 flex-1 flex-row items-center gap-3">{profileBody}</View>
      )}
      {allowAddToCircle && onAddToCircle ? (
        <Pressable
          onPress={onAddToCircle}
          className="flex-row items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 active:bg-muted/60"
        >
          <PlusCircle size={13} color={Theme.colors.secondaryText} />
          <Text className="text-[11px] font-medium text-muted-foreground">Add to Circle</Text>
        </Pressable>
      ) : null}
      {onUserPress ? (
        <Pressable
          onPress={() => onUserPress(row.user_id)}
          accessibilityRole="button"
          accessibilityLabel={`View ${label}'s profile`}
          hitSlop={8}
          className="justify-center rounded-lg p-0.5 active:opacity-70"
        >
          <ChevronRight size={16} color={Theme.colors.secondaryText} />
        </Pressable>
      ) : null}
    </View>
  );
}
