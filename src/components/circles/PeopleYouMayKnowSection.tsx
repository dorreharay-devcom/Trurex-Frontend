import React, { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, X } from 'lucide-react-native';
import {
  dismissPeopleSuggestion,
  fetchPeopleSuggestions,
  followUserFromPeopleSuggestion,
} from '~/api/peopleSuggestionsApi';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { Theme } from '~/theme/Theme';
import type { PeopleSuggestionRow } from '~/types/peopleSuggestions';
import { toastError, toastSuccess } from '~/utils/appToast';
import { unknownErrorMessage } from '~/utils';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';

function ordinalDegreeLabel(degree: number): string {
  const j = degree % 10;
  const k = degree % 100;
  if (j === 1 && k !== 11) return `${degree}st`;
  if (j === 2 && k !== 12) return `${degree}nd`;
  if (j === 3 && k !== 13) return `${degree}rd`;
  return `${degree}th`;
}

function formatSuggestionSubtitle(s: PeopleSuggestionRow): string | undefined {
  if (s.primary_reason === 'fallback_global') return 'Suggested for you';
  return undefined;
}

function PeopleYouMayKnowCard({
  suggestion,
  onDismiss,
  onFollow,
  isFollowing,
  dismissPending,
  followPending,
  cardStyle,
  onUserPress,
}: {
  suggestion: PeopleSuggestionRow;
  onDismiss: () => void;
  onFollow: () => void;
  isFollowing: boolean;
  dismissPending: boolean;
  followPending: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  onUserPress?: (userId: string) => void;
}) {
  const label = suggestion.display_name ?? 'Member';
  const subline = formatSuggestionSubtitle(suggestion);

  const profilePress =
    onUserPress != null
      ? () => {
          onUserPress(suggestion.candidate_user_id);
        }
      : undefined;

  return (
    <View
      style={cardStyle}
      className="relative shrink-0 flex-col self-stretch rounded-xl border border-border bg-card p-3 shadow-sm"
    >
      <Pressable
        onPress={onDismiss}
        hitSlop={8}
        disabled={dismissPending}
        className="absolute right-2 top-2 z-10 rounded-md p-1 active:opacity-70 disabled:opacity-40"
      >
        <X size={14} color={Theme.colors.muted} />
      </Pressable>

      <Pressable
        onPress={profilePress}
        disabled={!profilePress}
        className={`flex-row items-start gap-3 pr-6 ${profilePress ? 'active:opacity-80' : ''}`}
      >
        <SignedUserAvatar
          name={label}
          avatar={suggestion.avatar_url}
          className="h-12 w-12 rounded-xl"
        />
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {label}
          </Text>
          {suggestion.connection_degree != null && suggestion.connection_degree >= 1 ? (
            <View className="mt-1.5 self-start rounded-full border border-border bg-card px-2 py-0.5">
              <Text className="text-[11px] font-medium text-muted-foreground">
                {ordinalDegreeLabel(suggestion.connection_degree)} degree
              </Text>
            </View>
          ) : null}
          {subline ? (
            <Text className="mt-1.5 text-xs text-muted-foreground" numberOfLines={2}>
              {subline}
            </Text>
          ) : null}
          {suggestion.handle ? (
            <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
              @{suggestion.handle}
            </Text>
          ) : null}
        </View>
      </Pressable>

      <View className="mt-1.5 flex-row justify-end">
        {isFollowing ? (
          <View className="rounded-lg border border-border bg-muted px-3 py-1.5">
            <Text className="text-xs font-medium text-muted-foreground">Following</Text>
          </View>
        ) : (
          <Pressable
            onPress={onFollow}
            disabled={followPending}
            className="flex-row items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 active:opacity-90 disabled:opacity-50"
          >
            <UserPlus size={14} color={Theme.colors.primaryForeground} />
            <Text className="text-xs font-semibold text-primary-foreground">Follow</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

type Props = {
  isActive: boolean;
  onUserPress?: (userId: string) => void;
};

export function PeopleYouMayKnowSection({ isActive, onUserPress }: Props) {
  const queryClient = useQueryClient();
  const { width: windowWidth } = useWindowDimensions();
  const carouselCardWidth = Math.min(288, Math.max(240, Math.floor(windowWidth - 48)));

  const {
    data: rows = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['people_suggestions'],
    queryFn: () => fetchPeopleSuggestions({ input_limit: 20, input_offset: 0 }),
    enabled: isActive,
    staleTime: 60_000,
  });

  const dismissMutation = useMutation({
    mutationFn: dismissPeopleSuggestion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people_suggestions'] });
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not dismiss', unknownErrorMessage(e, 'Try again.'));
    },
  });

  const followMutation = useMutation({
    mutationFn: followUserFromPeopleSuggestion,
    onSuccess: () => {
      toastSuccess('Following');
      void queryClient.invalidateQueries({ queryKey: ['people_suggestions'] });
      void queryClient.invalidateQueries({ queryKey: ['trusted_users'] });
      void queryClient.invalidateQueries({ queryKey: ['user_followers'] });
      void queryClient.invalidateQueries({ queryKey: ['user_following'] });
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not follow', unknownErrorMessage(e, 'Try again.'));
    },
  });

  const onDismiss = useCallback(
    (id: string) => {
      dismissMutation.mutate(id);
    },
    [dismissMutation],
  );

  const onFollow = useCallback(
    (id: string) => {
      followMutation.mutate(id);
    },
    [followMutation],
  );

  const dismissPendingFor = useCallback(
    (id: string) => dismissMutation.isPending && dismissMutation.variables === id,
    [dismissMutation.isPending, dismissMutation.variables],
  );

  const followPendingFor = useCallback(
    (id: string) => followMutation.isPending && followMutation.variables === id,
    [followMutation.isPending, followMutation.variables],
  );

  if (isLoading && rows.length === 0) {
    return (
      <View className="mt-10 items-center py-6">
        <Text className="mb-3 self-stretch text-base font-semibold text-foreground">
          People you might know
        </Text>
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return null;
  }

  if (rows.length === 0) {
    return (
      <View className="mt-10">
        <Text className="mb-3 text-base font-semibold text-foreground">People you might know</Text>
        <Text className="text-center text-sm text-muted-foreground">No suggestions right now.</Text>
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
        {rows.map((s) => (
          <PeopleYouMayKnowCard
            key={s.candidate_user_id}
            cardStyle={{ width: carouselCardWidth }}
            suggestion={s}
            isFollowing={s.relationship_status === 'following'}
            dismissPending={dismissPendingFor(s.candidate_user_id)}
            followPending={followPendingFor(s.candidate_user_id)}
            onDismiss={() => onDismiss(s.candidate_user_id)}
            onFollow={() => onFollow(s.candidate_user_id)}
            onUserPress={onUserPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}
