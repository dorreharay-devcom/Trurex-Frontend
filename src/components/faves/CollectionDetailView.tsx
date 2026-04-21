import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { ArrowLeft, Plus, MoreVertical, X, Trash2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import { webContainerStyle } from '~/utils';
import { Theme } from '~/theme/Theme';
import {
  useCollectionDetail,
  useRemoveRexFromCollection,
  useDeleteCollection,
} from '~/hooks/useCollections';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';

export interface CollectionDetailViewProps {
  collectionId: string;
  onBack: () => void;
  onAddItem: (collectionId: string) => void;
}

const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({
  collectionId,
  onBack,
  onAddItem,
}) => {
  const { data: detail, isLoading } = useCollectionDetail(collectionId);
  const { uri: coverUri } = useSignedStorageUrl(REX_IMAGES_BUCKET, detail?.cover_image_path ?? '');
  const removeMutation = useRemoveRexFromCollection(collectionId);
  const deleteMutation = useDeleteCollection();

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading || !detail) {
    return (
      <View className="px-4 pt-4" style={webContainerStyle}>
        <ActivityIndicator className="mt-6" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="px-4 pb-24"
    >
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity onPress={onBack} className="flex-row items-center gap-1">
          <ArrowLeft size={16} color={Theme.colors.muted} />
          <Text className="text-sm text-muted-foreground">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowMenu((v) => !v)} className="p-2">
          <MoreVertical size={18} color={Theme.colors.muted} />
        </TouchableOpacity>
      </View>

      {coverUri && (
        <Image
          source={{ uri: coverUri }}
          style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }}
          contentFit="cover"
        />
      )}
      <Text className="text-xl font-bold text-foreground">{detail.display_name}</Text>
      {detail.description && (
        <Text className="text-sm text-muted-foreground mt-1">{detail.description}</Text>
      )}

      <TouchableOpacity
        onPress={() => onAddItem(collectionId)}
        className="w-full flex-row items-center justify-center gap-2 py-3 my-4 rounded-xl border-2 border-dashed border-border"
      >
        <Plus size={16} color={Theme.colors.muted} />
        <Text className="text-sm font-medium text-muted-foreground">Add to Collection</Text>
      </TouchableOpacity>

      <View className="gap-3">
        {detail.rexes.map((rex) => (
          <View
            key={rex.rex_id}
            className="bg-card border border-border rounded-xl p-3 flex-row items-center gap-3"
          >
            <View className="w-12 h-12 bg-muted rounded-lg" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">{rex.place_name}</Text>
              <Text className="text-xs text-muted-foreground">{rex.category_code}</Text>
            </View>
            <TouchableOpacity onPress={() => removeMutation.mutate(rex.rex_id)}>
              <X size={14} color={Theme.colors.muted} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {showMenu && (
        <View className="absolute right-4 top-14 bg-card border border-border rounded-xl shadow-lg p-2 z-20">
          <TouchableOpacity
            onPress={() => {
              setShowDeleteConfirm(true);
              setShowMenu(false);
            }}
            className="flex-row items-center gap-2 px-4 py-2"
          >
            <Trash2 size={14} color={Theme.colors.destructive} />
            <Text className="text-sm text-destructive">Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-card rounded-xl p-6 w-full max-w-sm">
            <Text className="text-lg font-bold mb-4">Delete collection?</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-muted rounded-lg items-center"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteMutation.mutate(collectionId, { onSuccess: onBack })}
                className="flex-1 py-2 bg-destructive rounded-lg items-center"
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CollectionDetailView;
