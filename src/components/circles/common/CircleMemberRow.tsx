import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ChevronRight, UserMinus } from 'lucide-react-native';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import type { CircleMemberProfile } from '~/api/circlesApi';
import { Theme } from '~/theme/Theme';

type Props = {
  member: CircleMemberProfile;
  onUserPress?: (userId: string) => void;
  onRemove?: () => void;
  removing?: boolean;
};

export function CircleMemberRow({ member: m, onUserPress, onRemove, removing }: Props) {
  const label = m.display_name ?? 'Unknown';

  const profileBody = (
    <>
      <SignedUserAvatar name={m.display_name ?? '?'} avatar={m.avatar_url} className="h-10 w-10" />
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {label}
        </Text>
        {m.handle ? (
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            @{m.handle}
          </Text>
        ) : null}
      </View>
    </>
  );

  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
      {onUserPress ? (
        <Pressable
          onPress={() => onUserPress(m.user_id)}
          accessibilityRole="button"
          accessibilityLabel={`View ${label}'s profile`}
          className="min-w-0 flex-1 flex-row items-center gap-3 rounded-lg active:opacity-70"
        >
          {profileBody}
        </Pressable>
      ) : (
        <View className="min-w-0 flex-1 flex-row items-center gap-3">{profileBody}</View>
      )}
      {onRemove ? (
        <Pressable
          onPress={onRemove}
          disabled={removing}
          className="flex-row items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 active:opacity-90"
        >
          {removing ? (
            <ActivityIndicator size="small" color={Theme.colors.destructive} />
          ) : (
            <>
              <UserMinus size={14} color={Theme.colors.destructive} />
              <Text className="text-xs font-medium" style={{ color: Theme.colors.destructive }}>
                Remove
              </Text>
            </>
          )}
        </Pressable>
      ) : null}
      {onUserPress ? (
        <Pressable
          onPress={() => onUserPress(m.user_id)}
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
