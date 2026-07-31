import React from 'react';
import { Text, View } from 'react-native';
import { Link2 } from 'lucide-react-native';
import type { CollectionRexEntry } from '~/features/collections/types/collection';
import { Theme } from '~/shared/theme/Theme';

function WebsiteRow({ item }: { item: CollectionRexEntry }) {
  if (!item.is_online_place || !item.place_website_url) return null;

  return (
    <View className="mt-1 min-w-0 flex-row items-center gap-0.5 overflow-hidden">
      <Link2 size={10} color={Theme.colors.muted} style={{ flexShrink: 0 }} />
      <Text
        className="min-w-0 flex-1 text-[11px] text-muted-foreground"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.place_website_url}
      </Text>
    </View>
  );
}

export default WebsiteRow;
