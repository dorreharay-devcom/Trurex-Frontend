import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';
import type { UserCollection } from '~/api/CollectionsApi';

const CARD_WIDTH = 176;
const CARD_HEIGHT = 224;

const GRADIENTS: [string, string][] = [
  ['#9333ea', '#ec4899'],
  ['#ec4899', '#f97316'],
  ['#f97316', '#f59e0b'],
  ['#14b8a6', '#10b981'],
  ['#0ea5e9', '#6366f1'],
  ['#d97706', '#eab308'],
];

function gradientForId(id: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff;
  return GRADIENTS[hash % GRADIENTS.length];
}

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

  const [gradStart, gradEnd] = gradientForId(collection.id);

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
      ) : loading && collection.cover_image_path ? (
        <View className="w-full h-full bg-muted items-center justify-center">
          <ActivityIndicator size="small" color={Theme.colors.primary} />
        </View>
      ) : (
        <LinearGradient
          colors={[gradStart, gradEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '100%', height: '100%' }}
        />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.78)']}
        locations={[0, 0.45, 1]}
        className="absolute inset-0"
      />

      <View className="absolute top-2 left-2">
        <View className="px-2 py-0.5 rounded-full bg-white/20">
          <Text className="text-[10px] font-semibold text-white">
            {collection.is_my_collection ? 'Mine' : 'Saved'}
          </Text>
        </View>
      </View>

      <View className="absolute bottom-0 left-0 right-0 p-3">
        <Text className="text-sm font-bold text-white leading-tight" numberOfLines={2}>
          {collection.display_name}
        </Text>
        {collection.rex_count != null && (
          <Text className="text-[11px] text-white/70 mt-0.5">
            {collection.rex_count} {collection.rex_count === 1 ? 'rec' : 'recs'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard;
