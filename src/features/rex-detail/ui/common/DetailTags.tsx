import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { isListCollapsible, visibleListItems } from '~/shared/lib/data/collapsibleList';
import { ShowAllToggle } from '~/shared/ui/primitives/ShowAllToggle';

const DETAIL_TAGS_COLLAPSED_COUNT = 8;

function DetailTags({ tags }: { tags: string[] | null | undefined }) {
  const [showAll, setShowAll] = useState(false);

  if (!tags || tags.length === 0) return null;
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Features
        </Text>
        {isListCollapsible(tags, DETAIL_TAGS_COLLAPSED_COUNT) ? (
          <ShowAllToggle
            showAll={showAll}
            total={tags.length}
            onToggle={() => setShowAll((v) => !v)}
          />
        ) : null}
      </View>
      <View className="flex-row flex-wrap gap-2">
        {visibleListItems(tags, showAll, DETAIL_TAGS_COLLAPSED_COUNT).map((tag) => (
          <View key={tag} className="rounded-full border border-border/80 bg-border/40 px-3 py-1.5">
            <Text className="text-sm font-medium text-foreground">{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default DetailTags;
