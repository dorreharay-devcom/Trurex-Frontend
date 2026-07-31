import React from 'react';
import { Text, View } from 'react-native';
import { Link2, MapPin } from 'lucide-react-native';
import CategoryBadge from '~/pages/gems/ui/uncollected-rex-row/CategoryBadge';
import IconMetaRow from '~/pages/gems/ui/uncollected-rex-row/IconMetaRow';
import type { Recommendation } from '~/shared/types/recommendation';

function RexRowDetails({ item }: { item: Recommendation }) {
  const websiteUrl = item.isOnlinePlace ? item.placeWebsiteUrl : null;

  return (
    <View className="min-w-0 flex-1 overflow-hidden">
      <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
        {item.title}
      </Text>
      <CategoryBadge label={item.category} />
      <IconMetaRow icon={Link2} text={websiteUrl} />
      <IconMetaRow icon={MapPin} text={item.location} />
      {!!item.description && (
        <Text className="text-xs text-foreground/70 mt-1" numberOfLines={1}>
          {item.description}
        </Text>
      )}
    </View>
  );
}

export default RexRowDetails;
