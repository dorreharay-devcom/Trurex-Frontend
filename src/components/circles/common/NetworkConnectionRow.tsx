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
  additionalCirclesCount?: number;
  onAddToCircle?: () => void;
  allowAddToCircle?: boolean;
};

function CircleMembershipBadge({
  circle,
  accent,
  badgeBg,
  extraCount,
  interactive,
  onPress,
}: {
  circle: CircleApiRow;
  accent: string | null;
  badgeBg: string | undefined;
  extraCount: number;
  interactive: boolean;
  onPress?: () => void;
}) {
  const shellStyle = accent
    ? { backgroundColor: badgeBg }
    : { backgroundColor: Theme.colors.accent };
  const color = accent ?? Theme.colors.primary;
  const showExtra = extraCount > 0;
  const a11y = showExtra ? `${circle.name}, plus ${extraCount} more circles` : circle.name;

  const body = (
    <>
      <Text className="text-[10px] font-semibold" style={{ color }} numberOfLines={1}>
        {circle.name}
      </Text>
      {showExtra ? (
        <View
          className="absolute -right-1.5 -top-2 min-w-[18px] items-center rounded-full border border-border bg-card px-1 py-px"
          pointerEvents="none"
        >
          <Text className="text-[9px] font-bold leading-none text-foreground" numberOfLines={1}>
            +{extraCount}
          </Text>
        </View>
      ) : null}
    </>
  );

  if (interactive && onPress) {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={6}
        accessibilityLabel={a11y}
        className="relative rounded-full px-2 py-0.5 active:opacity-80"
        style={shellStyle}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={a11y}
      className="relative rounded-full px-2 py-0.5"
      style={shellStyle}
    >
      {body}
    </View>
  );
}

export function NetworkConnectionRow({
  row,
  circle,
  additionalCirclesCount = 0,
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
            <CircleMembershipBadge
              circle={circle}
              accent={accent}
              badgeBg={badgeBg}
              extraCount={additionalCirclesCount}
              interactive={Boolean(allowAddToCircle && onAddToCircle)}
              onPress={onAddToCircle}
            />
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
