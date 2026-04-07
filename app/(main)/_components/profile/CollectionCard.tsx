import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface Collection {
  id: string;
  name: string;
  emoji: string;
  count: number;
  image: string;
}

interface CollectionCardProps {
  collection: Collection;
  index?: number;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => (
  <TouchableOpacity 
    activeOpacity={0.85} 
    className="w-44 h-56 rounded-xl overflow-hidden shadow-card"
  >
    <Image source={{ uri: collection.image }} className="w-full h-full" resizeMode="cover" />
    <View className="absolute inset-0 bg-black/40" />
    <View className="absolute bottom-0 left-0 right-0 p-3">
      <Text className="text-2xl">{collection.emoji}</Text>
      <Text className="text-sm font-semibold text-white mt-1" numberOfLines={1}>
        {collection.name}
      </Text>
      <Text className="text-xs text-white/70">{collection.count} rexes</Text>
    </View>
  </TouchableOpacity>
);

export default CollectionCard;
