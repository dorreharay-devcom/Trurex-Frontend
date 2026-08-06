import React from 'react';
import { Text, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import CollectionCard from '~/features/collections/ui/CollectionCard';
import { PROFILE_TAB } from '~/features/profile/config/tabs';
import { profileGridLayout } from '~/features/profile/ui/ProfileGridCell';
import type { useProfileScreen } from '~/features/profile/hooks/useProfileScreen';
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

const LIST_CONTENT_STYLE = [webContainerStyle, { padding: 16, paddingBottom: 96 }];
const idKey = (item: { id: string }) => item.id;

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
  const { content, collectionOverlay } = flow;
  const isRecs = content.activeTab === PROFILE_TAB.recs;

  const header = (
    <ProfileBodyChrome flow={flow} avatarRefreshKey={avatarRefreshKey} onBack={onBack} />
  );

  if (isRecs) {
    return (
      <FlashList
        data={content.rexesLoading ? [] : content.myRexes}
        keyExtractor={idKey}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        onEndReached={content.loadMoreRexes}
        onEndReachedThreshold={0.45}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyBlock
            loading={content.rexesLoading}
            isError={content.rexesError}
            isRecs
            windowWidth={windowWidth}
            onRetry={content.retryRexes}
          />
        }
        ListFooterComponent={
          <QueryListFooter
            loading={content.isFetchingNextRexesPage}
            isError={content.isFetchNextRexesError}
            onRetry={content.loadMoreRexes}
          />
        }
        contentContainerStyle={LIST_CONTENT_STYLE}
        drawDistance={400}
        renderItem={({ item, index }) => (
          <ProfileGridCell index={index} numColumns={numColumns} cellWidth={cellWidth} gap={gap}>
            <ProfileRexCard rec={item} width={cellWidth} onPress={() => flow.onRexPress?.(item)} />
          </ProfileGridCell>
        )}
      />
    );
  }

  return (
    <FlashList
      data={content.collectionsLoading ? [] : content.myCollections}
      keyExtractor={idKey}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      onEndReached={content.loadMoreCollections}
      onEndReachedThreshold={0.45}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <EmptyBlock
          loading={content.collectionsLoading}
          isError={content.collectionsError}
          isRecs={false}
          windowWidth={windowWidth}
          onRetry={content.retryCollections}
        />
      }
      ListFooterComponent={
        <QueryListFooter
          loading={content.isFetchingNextCollectionsPage}
          isError={content.isFetchNextCollectionsError}
          onRetry={content.loadMoreCollections}
        />
      }
      contentContainerStyle={LIST_CONTENT_STYLE}
      drawDistance={400}
      renderItem={({ item, index }) => (
        <ProfileGridCell index={index} numColumns={numColumns} cellWidth={cellWidth} gap={gap}>
          <CollectionCard
            collection={item}
            width={cellWidth}
            onPress={() => collectionOverlay.openCollection(item.id)}
          />
        </ProfileGridCell>
      )}
    />
  );
};

export default ProfileMainBody;
