import React from 'react';
import { View, Text } from 'react-native';

function CardTags({ tags }: { tags: string[] | null | undefined }) {
  if (!tags || tags.length === 0) return null;
  return (
    <View className="flex-row flex-wrap gap-1.5 px-4 pt-2">
      {tags.map((tag) => (
        <View key={tag} className="rounded-full border border-border/80 bg-border/40 px-2 py-0.5">
          <Text className="text-xs font-medium text-foreground">#{tag}</Text>
        </View>
      ))}
    </View>
  );
}

export default CardTags;
