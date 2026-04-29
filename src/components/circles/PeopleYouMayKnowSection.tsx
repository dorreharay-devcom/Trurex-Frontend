import React, { useCallback, useMemo, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { UserPlus, X } from 'lucide-react-native';
import { MOCK_PEOPLE_YOU_MAY_KNOW } from '~/data/mockPeopleYouMayKnow';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { Theme } from '~/theme/Theme';
import type { SuggestedUser } from '~/types/network';

function PeopleYouMayKnowCard({
  suggestion,
  onDismiss,
  onMockFollow,
  followed,
  layout,
  cardStyle,
}: {
  suggestion: SuggestedUser;
  onDismiss: () => void;
  onMockFollow: () => void;
  followed: boolean;
  layout: 'stack' | 'carousel';
  cardStyle?: StyleProp<ViewStyle>;
}) {
  const label = suggestion.display_name ?? 'Member';
  const subline = suggestion.bio?.trim() || suggestion.location?.trim();

  return (
    <View
      style={cardStyle}
      className={`relative shrink-0 flex-col rounded-xl border border-border bg-card p-3 shadow-sm ${
        layout === 'stack' ? 'w-full max-w-full self-auto' : 'self-stretch'
      }`}
    >
      <Pressable
        onPress={onDismiss}
        hitSlop={8}
        className="absolute right-2 top-2 z-10 rounded-md p-1 active:opacity-70"
      >
        <X size={14} color={Theme.colors.muted} />
      </Pressable>

      <View className="flex-row items-start gap-3 pr-6">
        <SignedUserAvatar
          name={label}
          avatar={suggestion.avatar_url}
          className="h-12 w-12 rounded-xl"
        />
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {label}
          </Text>
          {subline ? (
            <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={2}>
              {subline}
            </Text>
          ) : null}
          {suggestion.handle ? (
            <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
              @{suggestion.handle}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="mt-1.5 flex-row justify-end">
        {followed ? (
          <View className="rounded-lg border border-border bg-muted px-3 py-1.5">
            <Text className="text-xs font-medium text-muted-foreground">Following</Text>
          </View>
        ) : (
          <Pressable
            onPress={onMockFollow}
            className="flex-row items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 active:opacity-90"
          >
            <UserPlus size={14} color={Theme.colors.primaryForeground} />
            <Text className="text-xs font-semibold text-primary-foreground">Follow</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const COMPACT_BREAKPOINT = 640;

export function PeopleYouMayKnowSection() {
  const { width: windowWidth } = useWindowDimensions();
  const compact = windowWidth < COMPACT_BREAKPOINT;
  const carouselCardWidth = Math.min(288, Math.max(240, Math.floor(windowWidth - 48)));

  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [followedMock, setFollowedMock] = useState<Set<string>>(() => new Set());

  const visible = useMemo(
    () => MOCK_PEOPLE_YOU_MAY_KNOW.filter((s) => !dismissed.has(s.user_id)),
    [dismissed],
  );

  const onDismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  }, []);

  const onMockFollow = useCallback((id: string) => {
    setFollowedMock((prev) => new Set(prev).add(id));
  }, []);

  if (visible.length === 0) {
    return (
      <View className="mt-10">
        <Text className="mb-3 text-base font-semibold text-foreground">People you might know</Text>
        <Text className="text-center text-sm text-muted-foreground">No suggestions right now.</Text>
      </View>
    );
  }

  if (compact) {
    return (
      <View className="mt-10 w-full max-w-full">
        <Text className="mb-3 text-base font-semibold text-foreground">People you might know</Text>
        <View className="w-full max-w-full gap-3">
          {visible.map((s) => (
            <PeopleYouMayKnowCard
              key={s.user_id}
              layout="stack"
              suggestion={s}
              followed={followedMock.has(s.user_id)}
              onDismiss={() => onDismiss(s.user_id)}
              onMockFollow={() => onMockFollow(s.user_id)}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="mt-10 w-full max-w-full overflow-hidden">
      <Text className="mb-3 text-base font-semibold text-foreground">People you might know</Text>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: 12,
          paddingBottom: 4,
          paddingRight: 8,
        }}
      >
        {visible.map((s) => (
          <PeopleYouMayKnowCard
            key={s.user_id}
            layout="carousel"
            cardStyle={{ width: carouselCardWidth }}
            suggestion={s}
            followed={followedMock.has(s.user_id)}
            onDismiss={() => onDismiss(s.user_id)}
            onMockFollow={() => onMockFollow(s.user_id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
