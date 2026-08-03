import React from 'react';
import { ActivityIndicator, Text, useWindowDimensions, View } from 'react-native';
import AnimatedRexCard from '~/features/profile/ui/rex-grid/AnimatedRexCard';
import { ProfileRexGridSkeleton } from '~/features/profile/ui/skeleton';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  loading: boolean;
  rows: Recommendation[];
  cellWidth: number;
  fetchingMore: boolean;
  onPressRex?: (rec: Recommendation) => void;
};

const ProfileRexGrid = ({ loading, rows, cellWidth, fetchingMore, onPressRex }: Props) => {
  const { width: windowWidth } = useWindowDimensions();

  if (loading) {
    return (
      <View className="p-4">
        <ProfileRexGridSkeleton windowWidth={windowWidth} />
      </View>
    );
  }

  if (rows.length === 0) {
    return <Text className="py-8 text-center text-sm text-muted-foreground">No rexes yet</Text>;
  }

  return (
    <View className="p-4">
      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        {rows.map((rec, i) => (
          <AnimatedRexCard
            key={rec.id}
            rec={rec}
            index={i}
            width={cellWidth}
            onPress={() => onPressRex?.(rec)}
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

export default ProfileRexGrid;
