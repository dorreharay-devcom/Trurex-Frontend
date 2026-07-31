import React from 'react';
import { View } from 'react-native';
import LocationStat from '~/features/collections/ui/collection-detail/rex-card/LocationStat';
import MoneyStat from '~/features/collections/ui/collection-detail/rex-card/MoneyStat';
import RatingStat from '~/features/collections/ui/collection-detail/rex-card/RatingStat';
import type { CollectionRexEntry } from '~/features/collections/types/collection';

function MetaRow({ item }: { item: CollectionRexEntry }) {
  if (!item.location && !item.rating && !item.score_value_for_money) return null;

  return (
    <View className="mt-1 min-w-0 flex-row items-center gap-2 overflow-hidden">
      <LocationStat location={item.location} />
      <RatingStat rating={item.rating} />
      <MoneyStat score={item.score_value_for_money} />
    </View>
  );
}

export default MetaRow;
