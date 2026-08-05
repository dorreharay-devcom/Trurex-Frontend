import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import type { UserCollection } from '~/features/collections/types/collection';

const CARD_WIDTH = 176;
const CARD_HEIGHT = 224;
const COLLECTION_FALLBACK_GRADIENT_COLORS = ['#F59B0A', '#B7C7CF'] as const;

type CollectionCardProps = {
  collection: UserCollection;
  width?: number;
  onPress?: () => void;
};

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  width = CARD_WIDTH,
  onPress,
}) => {
  const height = Math.round(width * (CARD_HEIGHT / CARD_WIDTH));
  const backgroundImagePath =
    collection.cover_image_path ?? collection.first_rex_photo_path ?? null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="rounded-xl overflow-hidden flex-shrink-0 bg-muted"
      style={{ width, height }}
    >
      <LinearGradient
        colors={COLLECTION_FALLBACK_GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />

      {backgroundImagePath ? (
        <SignedStorageImage
          bucket={REX_IMAGES_BUCKET}
          storagePath={backgroundImagePath}
          className="w-full h-full"
          contentFit="cover"
          skeletonUntilLoaded
        />
      ) : (
        <View className="w-full h-full" />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.78)']}
        locations={[0, 0.45, 1]}
        className="absolute inset-0"
      />

      <View className="absolute top-2 left-2">
        <View
          className={`px-2 py-0.5 rounded-full ${collection.is_my_collection ? 'bg-primary' : 'bg-black/50'}`}
        >
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
