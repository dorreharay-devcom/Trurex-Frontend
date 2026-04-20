import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { FolderOpen } from 'lucide-react-native';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';
import type { UserCollection } from '~/api/CollectionsApi';

interface CollectionCardProps {
  collection: UserCollection;
  width: number;
  onPress?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, width, onPress }) => {
  const height = Math.round(width * (4 / 3));
  const { uri: coverUri, loading } = useSignedStorageUrl(
    REX_IMAGES_BUCKET,
    collection.cover_image_path ?? '',
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{ width, height, borderRadius: 12, overflow: 'hidden' }}
    >
      {coverUri ? (
        <Image
          source={{ uri: coverUri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      ) : (
        <View style={{ width: '100%', height: '100%' }} className="bg-muted items-center justify-center">
          {loading && collection.cover_image_path ? (
            <ActivityIndicator size="small" color={Theme.colors.primary} />
          ) : (
            <FolderOpen size={28} color={Theme.colors.primary} />
          )}
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.72)']}
        locations={[0, 0.45, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 }}>
        <Text
          style={{ fontSize: 12, fontWeight: '700', color: 'white', lineHeight: 16 }}
          numberOfLines={2}
        >
          {collection.display_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CollectionCard;
