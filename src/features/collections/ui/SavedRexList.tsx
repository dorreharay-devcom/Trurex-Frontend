import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import SelectableSheetRow from '~/features/collections/ui/common/SelectableSheetRow';
import type { useSavedRexes } from '~/features/collections/hooks/data/useSavedRexes';
import { RexCoverThumbnail } from '~/shared/ui/media/RexCoverThumbnail';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import { Theme } from '~/shared/theme/Theme';

type SavedRexesState = ReturnType<typeof useSavedRexes>;

type Props = {
  list: SavedRexesState;
  selected: Set<string>;
  onToggle: (id: string) => void;
};

function SavedRexList({ list, selected, onToggle }: Props) {
  const { data: savedRexes = [], isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = list;

  if (isLoading) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator color={Theme.colors.muted} />
      </View>
    );
  }
  if (savedRexes.length === 0) {
    return <Text className="text-sm text-muted-foreground text-center py-6">No saved rexes</Text>;
  }
  return (
    <>
      {savedRexes.map((rec) => {
        const isSelected = selected.has(rec.id);
        return (
          <SelectableSheetRow
            key={rec.id}
            thumbnail={<RexCoverThumbnail rec={rec} className="h-10 w-10 rounded-lg" />}
            title={rec.title}
            subtitle={isSelected ? 'Selected' : rec.category}
            selected={isSelected}
            onPress={() => onToggle(rec.id)}
          />
        );
      })}
      <LoadMoreButton visible={hasNextPage} loading={isFetchingNextPage} onPress={fetchNextPage} />
    </>
  );
}

export default SavedRexList;
