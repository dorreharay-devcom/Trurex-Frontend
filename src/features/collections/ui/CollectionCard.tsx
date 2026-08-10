import React from 'react';
import { View, Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import type { UserCollection } from '~/features/collections/types/collection';

const CARD_WIDTH = 176;
const CARD_HEIGHT = 224;
const COLLECTION_ASPECT = CARD_WIDTH / CARD_HEIGHT;
const COLLECTION_FALLBACK_GRADIENT_COLORS = ['#F59B0A', '#B7C7CF'] as const;

type CollectionCardProps = {
  collection: UserCollection;
  width?: number;
  fill?: boolean;
  onPress?: () => void;
};

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  width = CARD_WIDTH,
  fill = false,
  onPress,
}) => {
  const backgroundImagePath =
    collection.cover_image_path ?? collection.first_rex_photo_path ?? null;

  const sizeStyle: StyleProp<ViewStyle> = fill
    ? { width: '100%', aspectRatio: COLLECTION_ASPECT }
    : { width, height: Math.round(width * (CARD_HEIGHT / CARD_WIDTH)), flexShrink: 0 };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="relative overflow-hidden rounded-xl bg-muted"
      style={sizeStyle}
    >
      <LinearGradient
        colors={COLLECTION_FALLBACK_GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />

      {backgroundImagePath ? (
        <SignedStorageImage
          bucket={REX_IMAGES_BUCKET}
          storagePath={backgroundImagePath}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          contentFit="cover"
          skeletonUntilLoaded
        />
      ) : null}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.78)']}
        locations={[0, 0.45, 1]}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />

      <View className="absolute left-2 top-2">
        <View
          className={`rounded-full px-2 py-0.5 ${collection.is_my_collection ? 'bg-primary' : 'bg-black/50'}`}
        >
          <Text className="text-[10px] font-semibold text-white">
            {collection.is_my_collection ? 'Mine' : 'Saved'}
          </Text>
        </View>
      </View>

      <View className="absolute bottom-0 left-0 right-0 p-3">
        <Text className="text-sm font-bold leading-tight text-white" numberOfLines={2}>
          {collection.display_name}
        </Text>
        {collection.rex_count != null && (
          <Text className="mt-0.5 text-[11px] text-white/70">
            {collection.rex_count} {collection.rex_count === 1 ? 'rec' : 'recs'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard;
