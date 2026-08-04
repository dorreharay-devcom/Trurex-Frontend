import React from 'react';
import { Text, View } from 'react-native';
import MetaRow from '~/features/collections/ui/collection-detail/rex-card/MetaRow';
import WebsiteRow from '~/features/collections/ui/collection-detail/rex-card/WebsiteRow';
import type { CollectionRexEntry } from '~/features/collections/types/collection';

function RexCardDetails({ item }: { item: CollectionRexEntry }) {
  return (
    <View className="flex-1 min-w-0">
      <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
        {item.place_name}
      </Text>
      <Text className="text-xs text-muted-foreground">
        {item.category_name || item.category_code}
      </Text>
      <WebsiteRow item={item} />
      <MetaRow item={item} />
      {!!item.recommender_name && (
        <Text className="mt-0.5 text-[10px] font-medium text-muted-foreground">
          Rec'd by {item.recommender_name}
        </Text>
      )}
    </View>
  );
}

export default RexCardDetails;
