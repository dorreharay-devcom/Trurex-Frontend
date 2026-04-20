import React from 'react';
import { Text, View } from 'react-native';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import type { NetworkUserRow } from '~/types/network';

type Props = { row: NetworkUserRow };

export function NetworkPreviewRow({ row }: Props) {
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
    </View>
  );
}
