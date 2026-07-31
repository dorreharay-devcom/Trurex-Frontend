import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import SelectableSheetRow from '~/features/collections/ui/common/SelectableSheetRow';
import type {
  CollectionPickerState,
  CollectionWithCount,
} from '~/features/collections/hooks/add-to-collection/useCollectionPicker';
import { itemCountLabel } from '~/features/collections/lib/labels';
import { useSignedStorageUrl } from '~/shared/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/shared/config/storageBuckets';
import { Theme } from '~/shared/theme/Theme';
import { webContainerStyle } from '~/utils';

const COLLECTION_FALLBACK_GRADIENT_COLORS = ['#F59B0A', '#B7C7CF'] as const;

function CollectionCoverThumb({ col }: { col: CollectionWithCount }) {
  const backgroundImagePath = col.cover_image_path ?? col.first_rex_photo_path ?? '';
  const { uri: coverUri } = useSignedStorageUrl(REX_IMAGES_BUCKET, backgroundImagePath);

  return (
    <View className="w-10 h-10 rounded-lg overflow-hidden items-center justify-center shrink-0">
      <LinearGradient
        colors={COLLECTION_FALLBACK_GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {coverUri ? (
        <Image
          source={{ uri: coverUri }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      ) : null}
    </View>
  );
}

function LoadErrorRow({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <TouchableOpacity
      onPress={onRetry}
      className="w-full flex-row items-center gap-2 p-3 rounded-xl mb-1"
      style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
    >
      <AlertCircle size={16} color={Theme.colors.destructive} />
      <Text className="flex-1 text-sm text-destructive">{error}</Text>
      <Text className="text-xs font-medium text-destructive underline">Retry</Text>
    </TouchableOpacity>
  );
}

function ListBody({ picker }: { picker: CollectionPickerState }) {
  if (picker.loading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator color={Theme.colors.muted} />
      </View>
    );
  }
  if (picker.collections.length === 0 && !picker.error) {
    return (
      <Text className="text-sm text-muted-foreground text-center py-4">
        You have no collections yet
      </Text>
    );
  }
  return (
    <>
      {picker.collections.map((col) => (
        <SelectableSheetRow
          key={col.id}
          thumbnail={<CollectionCoverThumb col={col} />}
          title={col.display_name}
          subtitle={picker.selected.has(col.id) ? 'In collection' : itemCountLabel(col.item_count)}
          selected={picker.selected.has(col.id)}
          onPress={() => picker.toggle(col.id)}
        />
      ))}
    </>
  );
}

type Props = {
  picker: CollectionPickerState;
  maxHeight: number;
};

function CollectionPickerList({ picker, maxHeight }: Props) {
  return (
    <ScrollView
      style={{ maxHeight }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[{ padding: 12, gap: 2, minHeight: 160 }, webContainerStyle]}
    >
      {picker.error ? (
        <LoadErrorRow error={picker.error} onRetry={() => void picker.reload()} />
      ) : null}
      <ListBody picker={picker} />
    </ScrollView>
  );
}

export default CollectionPickerList;
