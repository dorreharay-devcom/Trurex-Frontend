import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { ArrowLeft, Plus, MoreVertical, X, Trash2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import ImageColors from 'react-native-image-colors';
import { webContainerStyle } from '~/utils';
import { Theme } from '~/theme/Theme';
import {
  useCollectionDetail,
  useRemoveRexFromCollection,
  useDeleteCollection,
} from '~/hooks/useCollections';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Backend, unwrap } from '~/services/AuthService';

const RexThumb: React.FC<{ rexId: string }> = ({ rexId }) => {
  const { data: photoPath } = useQuery({
    queryKey: ['rex-cover-path', rexId],
    queryFn: async () => {
      const detail = unwrap(await Backend.rpc('get_rex_detail', { input_rex_id: rexId }));
      const paths = (detail as any)?.photo_paths;
      return Array.isArray(paths) && paths.length > 0 ? String(paths[0]) : null;
    },
    staleTime: 5 * 60 * 1000,
  });
  const { uri } = useSignedStorageUrl(REX_IMAGES_BUCKET, photoPath ?? '');

  return (
    <View className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
      {uri && <Image source={{ uri }} style={{ width: 48, height: 48 }} contentFit="cover" />}
    </View>
  );
};

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
  const [coverBg, setCoverBg] = useState('#1a1a1a');

  useEffect(() => {
    if (!coverUri) return;
    ImageColors.getColors(coverUri, { fallback: '#1a1a1a', cache: true, key: coverUri })
      .then((colors) => {
        const color =
          colors.platform === 'ios'
            ? colors.primary
            : colors.platform === 'android'
              ? colors.dominant
              : colors.platform === 'web'
                ? colors.dominant
                : '#1a1a1a';
        setCoverBg(color ?? '#1a1a1a');
      })
      .catch(() => {});
  }, [coverUri]);
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
        <View
          style={{ width: '100%', height: 220, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}
        >
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: coverBg, opacity: 0.15 }} />
          <Image
            source={{ uri: coverUri }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
        </View>
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
            <RexThumb rexId={rex.rex_id} />
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
