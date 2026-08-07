import React, { useCallback } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import CollectionCard from '~/features/collections/ui/CollectionCard';
import { PROFILE_TAB } from '~/features/profile/config/tabs';
import { profileGridLayout } from '~/features/profile/ui/ProfileGridCell';
import type { useProfileScreen } from '~/features/profile/hooks/useProfileScreen';
import ProfileBackButton from '~/features/profile/ui/ProfileBackButton';
import ProfileBodyChrome from '~/features/profile/ui/ProfileBodyChrome';
import ProfileGridCell from '~/features/profile/ui/ProfileGridCell';
import ProfileRexCard from '~/features/profile/ui/ProfileRexCard';
import { ProfileCollectionsSkeleton, ProfileRexGridSkeleton } from '~/features/profile/ui/skeleton';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import QueryListFooter from '~/shared/ui/query/QueryListFooter';
import { webContainerStyle } from '~/shared/lib/ui/styles';

type Flow = ReturnType<typeof useProfileScreen>;

type Props = {
  flow: Flow;
  avatarRefreshKey: number;
  onBack?: () => void;
};

const NEAR_END_PX = 320;

function EmptyBlock({
  loading,
  isError,
  isRecs,
  windowWidth,
  onRetry,
}: {
  loading: boolean;
  isError: boolean;
  isRecs: boolean;
  windowWidth: number;
  onRetry: () => void;
}) {
  if (loading) {
    return isRecs ? (
      <ProfileRexGridSkeleton windowWidth={windowWidth} />
    ) : (
      <ProfileCollectionsSkeleton windowWidth={windowWidth} />
    );
  }
  if (isError) {
    return (
      <QueryErrorState
        title={isRecs ? "Couldn't load rexes" : "Couldn't load collections"}
        onRetry={onRetry}
      />
    );
  }
  return (
    <Text className="py-8 text-center text-sm text-muted-foreground">
      {isRecs ? 'No rexes yet' : 'No collections yet'}
    </Text>
  );
}

const ProfileMainBody = ({ flow, avatarRefreshKey, onBack }: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const { numColumns, cellWidth, gap } = profileGridLayout(windowWidth);
  const { content } = flow;
  const isRecs = content.activeTab === PROFILE_TAB.recs;
  const items = isRecs ? content.myRexes : content.myCollections;
  const loading = isRecs ? content.rexesLoading : content.collectionsLoading;
  const isError = isRecs ? content.rexesError : content.collectionsError;
  const hasItems = items.length > 0;

  const loadMore = isRecs ? content.loadMoreRexes : content.loadMoreCollections;

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!hasItems) return;
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      if (layoutMeasurement.height + contentOffset.y < contentSize.height - NEAR_END_PX) return;
      loadMore();
    },
    [hasItems, loadMore],
  );

  return (
    <ScrollView
      className="min-h-0 flex-1"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
      scrollEventThrottle={16}
      onScroll={onScroll}
      contentContainerStyle={[
        webContainerStyle,
        {
          flexGrow: 0,
          padding: 16,
          paddingBottom: 96,
        },
      ]}
    >
      {onBack ? <ProfileBackButton onPress={onBack} className="mb-3" /> : null}

      <View className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <ProfileBodyChrome flow={flow} avatarRefreshKey={avatarRefreshKey} />

        {hasItems ? (
          <>
            <View className="flex-row flex-wrap px-4 pb-4">
              {isRecs
                ? content.myRexes.map((item, index) => (
                    <ProfileGridCell
                      key={item.id}
                      index={index}
                      numColumns={numColumns}
                      cellWidth={cellWidth}
                      gap={gap}
                    >
                      <ProfileRexCard
                        rec={item}
                        width={cellWidth}
                        onPress={() => flow.onRexPress?.(item)}
                      />
                    </ProfileGridCell>
                  ))
                : content.myCollections.map((item, index) => (
                    <ProfileGridCell
                      key={item.id}
                      index={index}
                      numColumns={numColumns}
                      cellWidth={cellWidth}
                      gap={gap}
                    >
                      <CollectionCard
                        collection={item}
                        width={cellWidth}
                        onPress={() => flow.openCollection(item.id)}
                      />
                    </ProfileGridCell>
                  ))}
            </View>
            <QueryListFooter
              loading={isRecs ? content.isFetchingNextRexesPage : content.isFetchingNextCollectionsPage}
              isError={isRecs ? content.isFetchNextRexesError : content.isFetchNextCollectionsError}
              onRetry={loadMore}
            />
          </>
        ) : (
          <View className="px-4 pb-2">
            <EmptyBlock
              loading={loading}
              isError={isError}
              isRecs={isRecs}
              windowWidth={windowWidth}
              onRetry={isRecs ? content.retryRexes : content.retryCollections}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileMainBody;
