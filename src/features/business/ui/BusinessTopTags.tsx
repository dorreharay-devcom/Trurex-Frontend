import React from 'react';
import { Text, View } from 'react-native';
import type { PlaceTopTag } from '~/features/business/types/placeSummary';

function BusinessTopTags({ tags }: { tags: PlaceTopTag[] }) {
  if (tags.length === 0) return null;

  return (
    <View className="gap-3">
      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Top tags
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag) => (
          <View
            key={tag.slug}
            className="rounded-full border border-border/80 bg-border/40 px-3 py-1.5"
          >
            <Text className="text-sm font-medium text-foreground">{tag.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default BusinessTopTags;
