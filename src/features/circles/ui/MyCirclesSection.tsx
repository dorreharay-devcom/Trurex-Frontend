import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useMyCircleRows } from '~/features/circles/hooks/data/useMyCircleRows';
import RowSkeletonList from '~/features/circles/ui/common/RowSkeletonList';
import CircleList from '~/features/circles/ui/CircleList';
import CreateCircleCard from '~/features/circles/ui/CreateCircleCard';
import { Theme } from '~/shared/theme/Theme';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';

type Props = {
  enabled: boolean;
  onOpenCircle: (circleId: string) => void;
};

const MyCirclesSection = ({ enabled, onOpenCircle }: Props) => {
  const { displayRows, isLoading, isError, retry } = useMyCircleRows(enabled);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <Text className="mb-3 text-base font-semibold text-foreground">My Circles</Text>

      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-foreground">Trust Circles</Text>
        <Pressable
          onPress={() => setShowCreate((open) => !open)}
          className="flex-row items-center gap-1 rounded-lg bg-primary px-3 py-2 active:opacity-90"
        >
          <Plus size={14} color={Theme.colors.primaryForeground} />
          <Text className="text-xs font-semibold text-primary-foreground">New Circle</Text>
        </Pressable>
      </View>

      {showCreate && <CreateCircleCard onClose={() => setShowCreate(false)} />}

      {isLoading && <RowSkeletonList count={3} className="gap-3" />}

      {isError && <QueryErrorState title="Couldn't load circles" onRetry={retry} />}

      {!isLoading && !isError && <CircleList rows={displayRows} onOpenCircle={onOpenCircle} />}
    </>
  );
};

export default MyCirclesSection;
