import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { Theme } from '~/shared/theme/Theme';
import type { MentionCandidate } from '~/features/mentions/types/mention';

const END_REACHED_THRESHOLD_PX = 24;

type Props = {
  candidates: MentionCandidate[];
  onSelect: (candidate: MentionCandidate) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

function MentionSuggestionsList({ candidates, onSelect, onLoadMore, isLoadingMore }: Props) {
  if (candidates.length === 0) return null;

  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    const distanceToBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    if (distanceToBottom <= END_REACHED_THRESHOLD_PX) onLoadMore?.();
  };

  return (
    <View className="mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-card/95 shadow-md">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="max-h-48"
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        {candidates.map((candidate) => (
          <Pressable
            key={candidate.userId}
            onPress={() => onSelect(candidate)}
            className="flex-row items-center gap-2.5 border-b border-border/60 px-3 py-2 active:bg-muted/30"
          >
            <SignedUserAvatar
              name={candidate.displayName}
              avatar={candidate.avatarUrl}
              className="h-7 w-7"
              sizePt={28}
            />
            <View className="min-w-0 flex-1">
              <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                {candidate.displayName}
              </Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                @{candidate.handle}
              </Text>
            </View>
          </Pressable>
        ))}
        {isLoadingMore ? (
          <View className="items-center py-2">
            <ActivityIndicator size="small" color={Theme.colors.secondaryText} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

export default MentionSuggestionsList;
