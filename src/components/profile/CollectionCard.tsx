import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';
import type { UserCollection } from '~/api/CollectionsApi';

const CARD_WIDTH = 176;
const CARD_HEIGHT = 224;

const GRADIENTS: [string, string][] = [
  ['#9333ea', '#ec4899'],
  ['#ec4899', '#B7C7CF'],
  ['#B7C7CF', '#8FA3AC'],
  ['#14b8a6', '#10b981'],
  ['#0ea5e9', '#6366f1'],
  ['#9BB0BA', '#B7C7CF'],
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
  const [gradStart, gradEnd] = gradientForId(collection.id);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="rounded-xl overflow-hidden flex-shrink-0 bg-muted"
      style={{ width, height }}
    >
      <SignedStorageImage
        bucket={REX_IMAGES_BUCKET}
        storagePath={collection.cover_image_path}
        className="w-full h-full"
        contentFit="cover"
      />

      {!collection.cover_image_path && (
        <LinearGradient
          colors={[gradStart, gradEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.78)']}
        locations={[0, 0.45, 1]}
        className="absolute inset-0"
      />

      <View className="absolute top-2 left-2">
        <View className={`px-2 py-0.5 rounded-full ${collection.is_my_collection ? 'bg-primary' : 'bg-black/50'}`}>
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