import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { FolderOpen } from 'lucide-react-native';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';
import type { UserCollection } from '~/api/CollectionsApi';

const CARD_WIDTH = 176;
const CARD_HEIGHT = 224;

interface CollectionCardProps {
  collection: UserCollection;
  width?: number;
  onPress?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  width = CARD_WIDTH,
  onPress,
}) => {
  const height = Math.round(width * (CARD_HEIGHT / CARD_WIDTH));
  const { uri: coverUri, loading } = useSignedStorageUrl(
    REX_IMAGES_BUCKET,
    collection.cover_image_path ?? '',
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="rounded-xl overflow-hidden flex-shrink-0"
      style={{ width, height }}
    >
      {coverUri ? (
        <Image
          source={{ uri: coverUri }}
          className="w-full h-full"
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      ) : (
        <View className="w-full h-full bg-muted items-center justify-center">
          {loading && collection.cover_image_path ? (
            <ActivityIndicator size="small" color={Theme.colors.primary} />
          ) : (
            <FolderOpen size={28} color={Theme.colors.primary} />
          )}
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.82)']}
        locations={[0, 0.45, 1]}
        className="absolute inset-0"
      />

      <View className="absolute top-2.5 right-2.5">
        <View
          className={`px-2 py-0.5 rounded-full ${collection.is_my_collection ? 'bg-primary/80' : 'bg-black/50'}`}
        >
          <Text className="text-[10px] font-semibold text-white">
            {collection.is_my_collection ? 'Mine' : 'Saved'}
          </Text>
        </View>
      </View>

      <View className="absolute bottom-0 left-0 right-0 p-4">
        <Text className="text-sm font-bold text-white leading-tight" numberOfLines={2}>
          {collection.display_name}
        </Text>
        {collection.rex_count != null && (
          <Text className="text-xs text-white/70 mt-0.5">
            {collection.rex_count} {collection.rex_count === 1 ? 'Rex' : "Rex's"}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard;
