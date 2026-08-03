import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { suggestionSubtitle } from '~/features/circles/lib/labels';
import type { PeopleSuggestionRow } from '~/features/circles/types/peopleSuggestions';
import DegreeBadge from '~/features/circles/ui/people/DegreeBadge';
import FollowAction from '~/features/circles/ui/people/FollowAction';
import { Theme } from '~/shared/theme/Theme';
import { SignedUserAvatar } from '~/shared/ui/SignedUserAvatar';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  suggestion: PeopleSuggestionRow;
  onDismiss: () => void;
  onFollow: () => void;
  isFollowing: boolean;
  dismissPending: boolean;
  followPending: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  onUserPress?: (userId: string) => void;
};

const PeopleYouMayKnowCard = ({
  suggestion,
  onDismiss,
  onFollow,
  isFollowing,
  dismissPending,
  followPending,
  cardStyle,
  onUserPress,
}: Props) => {
  const label = suggestion.display_name ?? 'Member';
  const subline = suggestionSubtitle(suggestion);
  const pressProfile = onUserPress ? () => onUserPress(suggestion.candidate_user_id) : undefined;

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
        onPress={pressProfile}
        disabled={!pressProfile}
        className={cn('flex-row items-start gap-3 pr-6', pressProfile && 'active:opacity-80')}
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
          <DegreeBadge degree={suggestion.connection_degree} />
          {subline && (
            <Text className="mt-1.5 text-xs text-muted-foreground" numberOfLines={2}>
              {subline}
            </Text>
          )}
          <Text
            className={cn(
              'mt-0.5 text-xs text-muted-foreground',
              !suggestion.handle && 'opacity-0',
            )}
            numberOfLines={1}
          >
            {suggestion.handle ? `@${suggestion.handle}` : '@placeholder'}
          </Text>
        </View>
      </Pressable>

      <View className="mt-1.5 flex-row justify-end">
        <FollowAction isFollowing={isFollowing} pending={followPending} onFollow={onFollow} />
      </View>
    </View>
  );
};

export default PeopleYouMayKnowCard;
