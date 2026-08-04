import React from 'react';
import { View, Text } from 'react-native';

function DetailTags({ tags }: { tags: string[] | null | undefined }) {
  if (!tags || tags.length === 0) return null;
  return (
    <View className="gap-3">
      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Features
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag) => (
          <View key={tag} className="rounded-full border border-border/80 bg-border/40 px-3 py-1.5">
            <Text className="text-sm font-medium text-foreground">{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default DetailTags;
