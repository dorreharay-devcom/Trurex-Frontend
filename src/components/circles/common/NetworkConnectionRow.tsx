import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import type { CircleApiRow } from '~/api/circlesApi';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { Theme } from '~/theme/Theme';
import type { NetworkUserRow } from '~/types/network';
import { hexToSoftIconBackground, parseCircleAccentHex } from '~/utils/recommendation/recCircles';

type Props = {
  row: NetworkUserRow;
  circle?: CircleApiRow;
  onAddToCircle?: () => void;
  allowAddToCircle?: boolean;
};

export function NetworkConnectionRow({
  row,
  circle,
  onAddToCircle,
  allowAddToCircle = true,
}: Props) {
  const label = row.display_name || 'Member';
  const accent = circle ? (parseCircleAccentHex(circle) ?? Theme.colors.primary) : null;
  const badgeBg = accent ? hexToSoftIconBackground(accent, 0.14) : undefined;

  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
      <SignedUserAvatar name={label} avatar={row.avatar_url} className="h-10 w-10" />
      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-center gap-1.5">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {label}
          </Text>
          {circle ? (
            allowAddToCircle && onAddToCircle ? (
              <Pressable
                onPress={onAddToCircle}
                hitSlop={6}
                className="rounded-full px-2 py-0.5 active:opacity-80"
                style={
                  accent ? { backgroundColor: badgeBg } : { backgroundColor: Theme.colors.accent }
                }
              >
                <Text
                  className="text-[10px] font-semibold"
                  style={{ color: accent ?? Theme.colors.primary }}
                  numberOfLines={1}
                >
                  {circle.name}
                </Text>
              </Pressable>
            ) : (
              <View
                className="rounded-full px-2 py-0.5"
                style={
                  accent ? { backgroundColor: badgeBg } : { backgroundColor: Theme.colors.accent }
                }
              >
                <Text
                  className="text-[10px] font-semibold"
                  style={{ color: accent ?? Theme.colors.primary }}
                  numberOfLines={1}
                >
                  {circle.name}
                </Text>
              </View>
            )
          ) : null}
        </View>
        {row.handle ? (
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            @{row.handle}
          </Text>
        ) : null}
      </View>
      {allowAddToCircle && onAddToCircle ? (
        <Pressable
          onPress={onAddToCircle}
          className="flex-row items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 active:bg-muted/60"
        >
          <PlusCircle size={13} color={Theme.colors.secondaryText} />
          <Text className="text-[11px] font-medium text-muted-foreground">Add to Circle</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
