import React from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SUGGESTION_RELATIONSHIP } from '~/features/circles/config/peopleSuggestions';
import { usePeopleSuggestions } from '~/features/circles/hooks/data/usePeopleSuggestions';
import PeopleYouMayKnowCard from '~/features/circles/ui/people/PeopleYouMayKnowCard';
import RowSkeletonList from '~/features/circles/ui/common/RowSkeletonList';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';

const CARD_MAX_WIDTH = 288;
const CARD_MIN_WIDTH = 240;
const CARD_WINDOW_MARGIN = 48;

type Props = {
  enabled: boolean;
  onUserPress?: (userId: string) => void;
  embedInFeed?: boolean;
};

const PeopleYouMayKnowSection = ({ enabled, onUserPress, embedInFeed = false }: Props) => {
  const people = usePeopleSuggestions(enabled);
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = Math.min(
    CARD_MAX_WIDTH,
    Math.max(CARD_MIN_WIDTH, Math.floor(windowWidth - CARD_WINDOW_MARGIN)),
  );

  const showSkeleton = people.isLoading && people.suggestions.length === 0;
  const isEmpty = !people.isError && !showSkeleton && people.suggestions.length === 0;

  if (embedInFeed && isEmpty) return null;

  return (
    <View
      className={
        embedInFeed
          ? 'mb-4 w-full max-w-full overflow-hidden px-4'
          : 'mt-10 w-full max-w-full overflow-hidden'
      }
    >
      <Text className="mb-3 text-base font-semibold text-foreground">People you might know</Text>

      {people.isError ? (
        <QueryErrorState
          compact
          title="Couldn't load suggestions"
          onRetry={() => void people.refetch()}
        />
      ) : null}

      {!people.isError && showSkeleton && <RowSkeletonList count={3} className="gap-2" />}

      {!people.isError && isEmpty && (
        <Text className="text-center text-sm text-muted-foreground">No suggestions right now.</Text>
      )}

      {!people.isError && !showSkeleton && people.suggestions.length > 0 && (
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
          {people.suggestions.map((suggestion) => (
            <PeopleYouMayKnowCard
              key={suggestion.candidate_user_id}
              cardStyle={{ width: cardWidth }}
              suggestion={suggestion}
              isFollowing={suggestion.relationship_status === SUGGESTION_RELATIONSHIP.following}
              dismissPending={people.isDismissing(suggestion.candidate_user_id)}
              followPending={people.isFollowPending(suggestion.candidate_user_id)}
              onDismiss={() => people.dismiss(suggestion.candidate_user_id)}
              onFollow={() => people.follow(suggestion.candidate_user_id)}
              onUserPress={onUserPress}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default PeopleYouMayKnowSection;
