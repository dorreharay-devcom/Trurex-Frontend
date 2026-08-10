import React, { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
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
const GRID_PAD = 16;

function EmptyBlock({
  loading,
  isError,
  isRecs,
  contentWidth,
  onRetry,
}: {
  loading: boolean;
  isError: boolean;
  isRecs: boolean;
  contentWidth: number;
  onRetry: () => void;
}) {
  if (loading) {
    return isRecs ? (
      <ProfileRexGridSkeleton windowWidth={contentWidth} />
    ) : (
      <ProfileCollectionsSkeleton windowWidth={contentWidth} />
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
  const [gridContentWidth, setGridContentWidth] = useState(() =>
    Math.max(windowWidth - GRID_PAD * 4, 1),
  );
  const { numColumns, cellWidth, gap } = profileGridLayout(gridContentWidth);
  const { content } = flow;
  const isRecs = content.activeTab === PROFILE_TAB.recs;
  const items = isRecs ? content.myRexes : content.myCollections;
  const loading = isRecs ? content.rexesLoading : content.collectionsLoading;
  const isError = isRecs ? content.rexesError : content.collectionsError;
  const hasItems = items.length > 0;

  const loadMore = isRecs ? content.loadMoreRexes : content.loadMoreCollections;

  const onGridLayout = useCallback((event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    if (next <= 0) return;
    setGridContentWidth((prev) => (prev === next ? prev : next));
  }, []);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!hasItems) return;
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      if (layoutMeasurement.height + contentOffset.y < contentSize.height - NEAR_END_PX) return;
      loadMore();
    },
    [hasItems, loadMore],
  );

  const halfGap = gap / 2;

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
          padding: GRID_PAD,
          paddingBottom: 96,
        },
      ]}
    >
      {onBack ? <ProfileBackButton onPress={onBack} className="mb-3" /> : null}

      <View className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <ProfileBodyChrome flow={flow} avatarRefreshKey={avatarRefreshKey} />

        {hasItems ? (
          <>
            <View className="px-4 pb-4">
              <View className="w-full" onLayout={onGridLayout}>
                <View className="w-full flex-row flex-wrap" style={{ marginHorizontal: -halfGap }}>
                  {isRecs
                    ? content.myRexes.map((item) => (
                        <ProfileGridCell key={item.id} numColumns={numColumns} gap={gap}>
                          <ProfileRexCard
                            rec={item}
                            width={cellWidth}
                            onPress={() => flow.onRexPress?.(item)}
                          />
                        </ProfileGridCell>
                      ))
                    : content.myCollections.map((item) => (
                        <ProfileGridCell key={item.id} numColumns={numColumns} gap={gap}>
                          <CollectionCard
                            collection={item}
                            fill
                            onPress={() => flow.openCollection(item.id)}
                          />
                        </ProfileGridCell>
                      ))}
                </View>
              </View>
            </View>
            <QueryListFooter
              loading={
                isRecs ? content.isFetchingNextRexesPage : content.isFetchingNextCollectionsPage
              }
              isError={isRecs ? content.isFetchNextRexesError : content.isFetchNextCollectionsError}
              onRetry={loadMore}
            />
          </>
        ) : (
          <View className="px-4 pb-2">
            <View className="w-full" onLayout={onGridLayout}>
              <EmptyBlock
                loading={loading}
                isError={isError}
                isRecs={isRecs}
                contentWidth={gridContentWidth}
                onRetry={isRecs ? content.retryRexes : content.retryCollections}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileMainBody;
