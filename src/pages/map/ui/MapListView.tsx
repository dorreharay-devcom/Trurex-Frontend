import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { MapPin } from 'lucide-react-native';
import ListRow from '~/features/map/ui/ListRow';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';
import { androidElevation, webContainerStyle } from '~/shared/lib/ui/styles';

type Props = {
  visible: boolean;
  rows: Recommendation[];
  selectedRecId: string | null;
  onPress: (rec: Recommendation) => void;
};

const keyExtractor = (item: Recommendation) => item.id;

const MapListView = memo(function MapListView({ visible, rows, selectedRecId, onPress }: Props) {
  const renderItem = useCallback<ListRenderItem<Recommendation>>(
    ({ item }) => (
      <View className="mb-2.5 px-4">
        <ListRow rec={item} highlighted={selectedRecId === item.id} onPress={() => onPress(item)} />
      </View>
    ),
    [onPress, selectedRecId],
  );

  const listEmpty = useMemo(
    () => (
      <View className="items-center py-12">
        <MapPin size={32} color={Theme.colors.secondaryText} style={{ opacity: 0.4 }} />
        <Text className="mt-2 text-sm font-medium text-muted-foreground">No Rex found</Text>
        <Text className="mt-1 text-center text-xs text-muted-foreground">
          Adjust search or map filters
        </Text>
      </View>
    ),
    [],
  );

  const contentContainerStyle = useMemo(() => [webContainerStyle, { paddingBottom: 112 }], []);

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.layer, androidElevation(2)]}>
      <FlashList
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={listEmpty}
        drawDistance={400}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  layer: {
    zIndex: 100,
    backgroundColor: Theme.colors.background,
    paddingTop: 128,
  },
});

export default MapListView;
