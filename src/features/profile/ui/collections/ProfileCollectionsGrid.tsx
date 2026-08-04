import React from 'react';
import { ActivityIndicator, Text, useWindowDimensions, View } from 'react-native';
import type { UserCollection } from '~/features/collections/types/collection';
import CollectionCard from '~/features/collections/ui/CollectionCard';
import { ProfileCollectionsSkeleton } from '~/features/profile/ui/skeleton';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  loading: boolean;
  rows: UserCollection[];
  cellWidth: number;
  fetchingMore: boolean;
  onOpenCollection: (id: string) => void;
};

const ProfileCollectionsGrid = ({
  loading,
  rows,
  cellWidth,
  fetchingMore,
  onOpenCollection,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();

  if (loading) {
    return <ProfileCollectionsSkeleton windowWidth={windowWidth} />;
  }

  if (rows.length === 0) {
    return (
      <Text className="py-8 text-center text-sm text-muted-foreground">No collections yet</Text>
    );
  }

  return (
    <View className="p-4">
      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        {rows.map((col) => (
          <CollectionCard
            key={col.id}
            collection={col}
            width={cellWidth}
            onPress={() => onOpenCollection(col.id)}
          />
        ))}
      </View>
      {fetchingMore && (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color={Theme.colors.primary} />
        </View>
      )}
    </View>
  );
};

export default ProfileCollectionsGrid;
