import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import ListRow from '~/features/map/ui/list/ListRow';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';
import { androidElevation, webContainerStyle } from '~/utils';

type Props = {
  visible: boolean;
  rows: Recommendation[];
  selectedRecId: string | null;
  onPress: (rec: Recommendation) => void;
};

const MapListView = ({ visible, rows, selectedRecId, onPress }: Props) => {
  if (!visible) return null;

  return (
    <ScrollView
      className="flex-1 w-full bg-background pt-32"
      style={[StyleSheet.absoluteFillObject, { zIndex: 100 }, androidElevation(2)]}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="w-full pb-28"
    >
      {rows.length === 0 ? (
        <View className="items-center py-12">
          <MapPin size={32} color={Theme.colors.secondaryText} style={{ opacity: 0.4 }} />
          <Text className="mt-2 text-sm font-medium text-muted-foreground">No Rex found</Text>
          <Text className="mt-1 text-center text-xs text-muted-foreground">
            Adjust search or map filters
          </Text>
        </View>
      ) : (
        <View className="gap-2.5">
          {rows.map((rec) => (
            <ListRow
              key={rec.id}
              rec={rec}
              highlighted={selectedRecId === rec.id}
              onPress={() => onPress(rec)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default MapListView;
